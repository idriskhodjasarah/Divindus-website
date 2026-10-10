const express = require('express');
const router = express.Router();
const supabaseAdmin = require('../supabaseAdmin');
const { requireAuth } = require('../middleware/requireAuth');

// ---------------------------------------------------------------------------
// POST /quotes — a customer requests a quote for a "sur devis" product.
// Client name/email/phone come from their own verified profile — never
// trusted from the request body. Only produit, product_id and details are.
// ---------------------------------------------------------------------------
router.post('/', requireAuth, async (req, res) => {
  const { produit, product_id, details } = req.body;

  if (!produit || !details) {
    return res.status(400).json({ error: 'Merci de préciser le produit et les détails de la demande.' });
  }

  const { data: profile } = await req.supabase.from('profiles').select('*').eq('id', req.user.id).single();

  const { data, error } = await req.supabase
    .from('quotes')
    .insert({
      user_id: req.user.id,
      client: profile ? `${profile.prenom} ${profile.nom}` : req.user.email,
      email: req.user.email,
      telephone: profile?.telephone || '',
      produit,
      product_id: product_id || null,
      details,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(400).json({ error: "Impossible d'envoyer la demande de devis." });
  }

  res.json({ quote: data });
});

// ---------------------------------------------------------------------------
// GET /quotes — a customer's own quote requests, or ALL of them if admin
// (RLS does the filtering).
// ---------------------------------------------------------------------------
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('quotes').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(400).json({ error: 'Impossible de charger les devis.' });
  }

  res.json({ quotes: data });
});

// ---------------------------------------------------------------------------
// POST /quotes/seen — the customer opened "Mes devis": mark their answered
// quotes as seen. Uses the admin client so we can allow changing ONLY this one
// flag, on ONLY the caller's own quotes.
// ---------------------------------------------------------------------------
router.post('/seen', requireAuth, async (req, res) => {
  const { error } = await supabaseAdmin
    .from('quotes')
    .update({ seen_by_client: true })
    .eq('user_id', req.user.id)
    .eq('status', 'répondu');

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Impossible de mettre à jour les devis.' });
  }

  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// PATCH /quotes/:id — admin answers a quote request (enforced by RLS).
// Answering resets "seen" and creates a notification for the customer.
// ---------------------------------------------------------------------------
router.patch('/:id', requireAuth, async (req, res) => {
  const { reponse_prix, reponse_message } = req.body;

  const { data, error } = await req.supabase
    .from('quotes')
    .update({ reponse_prix, reponse_message, status: 'répondu', seen_by_client: false })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(403).json({ error: 'Action réservée aux administrateurs.' });
  }

  // Notification belongs to the CUSTOMER, so use the admin client to insert
  // it on their behalf — the admin's own session has no permission to write
  // rows for someone else's user_id.
  await supabaseAdmin.from('notifications').insert({
    user_id: data.user_id,
    text: `Votre demande de devis pour "${data.produit}" a reçu une réponse.`,
  });

  res.json({ quote: data });
});

module.exports = router;