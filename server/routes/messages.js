const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/requireAuth');

// ---------------------------------------------------------------------------
// POST /messages — a customer sends a support message via "Aide et contact".
// Name/email come from their verified profile, never trusted from the body.
// ---------------------------------------------------------------------------
router.post('/', requireAuth, async (req, res) => {
  const { sujet, message } = req.body;

  if (!sujet || !message) {
    return res.status(400).json({ error: 'Merci de préciser un sujet et un message.' });
  }

  const { data: profile } = await req.supabase.from('profiles').select('*').eq('id', req.user.id).single();

  const { data, error } = await req.supabase
    .from('support_messages')
    .insert({
      user_id: req.user.id,
      nom: profile ? `${profile.prenom} ${profile.nom}` : req.user.email,
      email: req.user.email,
      sujet,
      message,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(400).json({ error: "Impossible d'envoyer le message." });
  }

  res.json({ message: data });
});

// ---------------------------------------------------------------------------
// GET /messages — a customer's own messages, or ALL of them if admin (RLS).
// ---------------------------------------------------------------------------
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('support_messages').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(400).json({ error: 'Impossible de charger les messages.' });
  }

  res.json({ messages: data });
});

// ---------------------------------------------------------------------------
// PATCH /messages/:id — admin toggles resolved (enforced by RLS).
// ---------------------------------------------------------------------------
router.patch('/:id', requireAuth, async (req, res) => {
  const { resolved } = req.body;

  const { data, error } = await req.supabase
    .from('support_messages')
    .update({ resolved })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(403).json({ error: 'Action réservée aux administrateurs.' });
  }

  res.json({ message: data });
});

module.exports = router;