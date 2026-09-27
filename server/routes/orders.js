const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/requireAuth');

// ---------------------------------------------------------------------------
// POST /orders — create an order + its line items (customer only, via RLS)
// ---------------------------------------------------------------------------
router.post('/', requireAuth, async (req, res) => {
  const { items, entreprise, nif, contact, telephone, wilaya, adresse, paiement } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Le panier est vide.' });
  }

  const ref = 'DVX-' + Math.floor(100000 + Math.random() * 900000);

  const { data: order, error: orderError } = await req.supabase
    .from('orders')
    .insert({ ref, user_id: req.user.id, entreprise, nif, contact, telephone, wilaya, adresse, paiement })
    .select()
    .single();

  if (orderError) {
    console.error(orderError);
    return res.status(400).json({ error: 'Impossible de créer la commande.' });
  }

  const itemsPayload = items.map((i) => ({
    order_id: order.id,
    product_id: i.id,
    name: i.name,
    filiale: i.filiale,
    qty: i.qty,
    price: i.price,
  }));

  const { error: itemsError } = await req.supabase.from('order_items').insert(itemsPayload);

  if (itemsError) {
    console.error(itemsError);
    return res.status(400).json({ error: 'Commande créée mais articles non enregistrés.' });
  }

  res.json({ order: { ...order, order_items: itemsPayload } });
});

// ---------------------------------------------------------------------------
// GET /orders — a customer's own orders, or EVERY order if the requester is
// an admin. No branching logic needed here: the RLS policy on "orders"
// already says "auth.uid() = user_id OR is_admin()", so Postgres filters
// the results correctly based on who's making the request.
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
// PATCH /orders/:id — update status fields (received, cancelled, refund_status...)
// Same idea: RLS lets the owning customer OR an admin update it, nobody else.
// ---------------------------------------------------------------------------
router.patch('/:id', requireAuth, async (req, res) => {
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

  res.json({ order: data });
});

module.exports = router;