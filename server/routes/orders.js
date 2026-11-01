const express = require('express');
const router = express.Router();
const supabaseAdmin = require('../supabaseAdmin');
const { requireAuth } = require('../middleware/requireAuth');

// ---------------------------------------------------------------------------
// POST /orders — create an order + its line items.
//
// Two modes:
//   1. Cart order:  { items: [{ id, qty }], ...customerDetails }
//   2. Quote order: { quote_id, quote_qty, ...customerDetails }
//
// In BOTH modes prices come from the database (products table, or the admin's
// answer on the quote) — never from the browser.
// ---------------------------------------------------------------------------
router.post('/', requireAuth, async (req, res) => {
  const { items, quote_id, quote_qty, entreprise, nif, contact, telephone, wilaya, adresse, paiement } = req.body;

  let lines = []; // { product_id, name, filiale, qty, price }
  let quote = null;

  if (quote_id) {
    // ---- Quote order -------------------------------------------------------
    const { data: q, error: qError } = await req.supabase.from('quotes').select('*').eq('id', quote_id).single();

    if (qError || !q || q.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Devis introuvable.' });
    }
    if (q.status !== 'répondu' || !q.reponse_prix) {
      return res.status(400).json({ error: "Ce devis n'a pas encore reçu de réponse." });
    }
    if (q.order_id) {
      return res.status(400).json({ error: 'Ce devis a déjà été commandé.' });
    }

    let filiale = null;
    if (q.product_id) {
      const { data: p } = await req.supabase.from('products').select('filiale').eq('id', q.product_id).single();
      filiale = p ? p.filiale : null;
    }

    quote = q;
    const qty = Math.min(999, Math.max(1, parseInt(quote_qty, 10) || 1));
    lines = [{ product_id: q.product_id || null, name: q.produit, filiale, qty, price: q.reponse_prix }];
  } else {
    // ---- Cart order --------------------------------------------------------
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide.' });
    }

    const ids = items.map((i) => i.id);
    const { data: products, error: pError } = await req.supabase.from('products').select('*').in('id', ids);

    if (pError) {
      console.error(pError);
      return res.status(400).json({ error: 'Impossible de vérifier les produits.' });
    }

    for (const item of items) {
      const p = products.find((x) => x.id === item.id);
      const qty = parseInt(item.qty, 10);

      if (!p || !p.active || p.price === null || !(qty > 0)) {
        return res.status(400).json({ error: 'Un article de la commande est invalide ou indisponible.' });
      }
      lines.push({ product_id: p.id, name: p.name, filiale: p.filiale, qty, price: p.price });
    }
  }

  const ref = 'DVX-' + Math.floor(100000 + Math.random() * 900000);

  const { data: order, error: orderError } = await req.supabase
    .from('orders')
    .insert({ ref, user_id: req.user.id, email: req.user.email, entreprise, nif, contact, telephone, wilaya, adresse, paiement })
    .select()
    .single();

  if (orderError) {
    console.error(orderError);
    return res.status(400).json({ error: 'Impossible de créer la commande.' });
  }

  const itemsPayload = lines.map((l) => ({ order_id: order.id, ...l }));

  const { error: itemsError } = await req.supabase.from('order_items').insert(itemsPayload);

  if (itemsError) {
    console.error(itemsError);
    return res.status(400).json({ error: 'Commande créée mais articles non enregistrés.' });
  }

  // Link the quote to its order so it can't be ordered a second time.
  // Admin client: customers have no permission to update quotes directly.
  if (quote) {
    await supabaseAdmin.from('quotes').update({ order_id: order.id }).eq('id', quote.id);
  }

  await req.supabase.from('notifications').insert({ user_id: req.user.id, text: `Votre commande ${ref} a été confirmée.` });

  res.json({ order: { ...order, order_items: itemsPayload } });
});

// ---------------------------------------------------------------------------
// GET /orders — a customer's own orders, or EVERY order if the requester is
// an admin (RLS does the filtering).
// ---------------------------------------------------------------------------
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('placed_at', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(400).json({ error: 'Impossible de charger les commandes.' });
  }

  res.json({ orders: data });
});

// ---------------------------------------------------------------------------
// POST /orders/seen — the customer opened "Mes commandes": mark their own
// orders as seen.
// ---------------------------------------------------------------------------
router.post('/seen', requireAuth, async (req, res) => {
  const { error } = await req.supabase.from('orders').update({ seen_by_client: true }).eq('user_id', req.user.id);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Impossible de mettre à jour les commandes.' });
  }

  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// PATCH /orders/:id — update status fields (received, cancelled, refund_status...)
// RLS lets the owning customer OR an admin update it, nobody else.
// Also creates the matching customer-facing notification for each real event.
// ---------------------------------------------------------------------------
router.patch('/:id', requireAuth, async (req, res) => {
  // "remboursee" means the money has genuinely been sent back — only an admin
  // confirms that, never the customer's own browser.
  if (req.body.refund_status === 'remboursee') {
    const { data: profile } = await req.supabase.from('profiles').select('is_admin').eq('id', req.user.id).single();
    if (!profile?.is_admin) {
      return res.status(403).json({ error: 'Seul un administrateur peut confirmer un remboursement.' });
    }
  }

  const { data, error } = await req.supabase
    .from('orders')
    .update(req.body)
    .eq('id', req.params.id)
    .select('*, order_items(*)')
    .single();

  if (error) {
    console.error(error);
    return res.status(403).json({ error: 'Action non autorisée ou commande introuvable.' });
  }

  // Build the matching notification for whichever field actually changed.
  // Admin-triggered changes (refund completed) use the admin client since
  // the notification belongs to the CUSTOMER, not the admin making the call.
  let notifText = null;
  let notifClient = req.supabase;

  if (req.body.received === true) {
    notifText = `Réception de la commande ${data.ref} confirmée — merci d'avoir commandé chez DIVINDUS.`;
  } else if (req.body.refund_status === 'remboursee') {
    notifText = `Remboursement de la commande ${data.ref} effectué.`;
    notifClient = supabaseAdmin;
  } else if (req.body.refund_status === 'en_cours') {
    notifText = `Demande d'annulation reçue pour la commande ${data.ref}. Remboursement sous 5 à 7 jours ouvrés.`;
  } else if (req.body.cancelled === true && !req.body.refund_status) {
    notifText = `Votre commande ${data.ref} a été annulée. Aucun paiement n'ayant encore été prélevé, aucun remboursement n'est nécessaire.`;
  }

  if (notifText) {
    await notifClient.from('notifications').insert({ user_id: data.user_id, text: notifText });
  }

  res.json({ order: data });
});

module.exports = router;