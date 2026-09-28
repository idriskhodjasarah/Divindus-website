const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/requireAuth');

// ---------------------------------------------------------------------------
// POST /quotes — a customer requests a quote for a "sur devis" product.
// Client name/email/phone are pulled from their own verified profile —
// never trusted from the request body — only "produit" and "details" are.
// ---------------------------------------------------------------------------
router.post('/', requireAuth, async (req, res) => {
  const { produit, details } = req.body;

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
      details,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(400).json({ error: 'Impossible d\'envoyer la demande de devis.' });
  }

  res.json({ quote: data });
});

// ---------------------------------------------------------------------------
// GET /quotes — a customer's own quote requests, or ALL of them if admin
// (same RLS-driven pattern as orders).
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
// PATCH /quotes/:id — admin answers a quote request (enforced by RLS).
// ---------------------------------------------------------------------------
router.patch('/:id', requireAuth, async (req, res) => {
  const { reponse_prix, reponse_message } = req.body;

  const { data, error } = await req.supabase
    .from('quotes')
    .update({ reponse_prix, reponse_message, status: 'répondu' })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(403).json({ error: 'Action réservée aux administrateurs.' });
  }

  res.json({ quote: data });
});

module.exports = router;