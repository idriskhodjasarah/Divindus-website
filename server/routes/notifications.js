const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/requireAuth');

// ---------------------------------------------------------------------------
// GET /notifications — a customer's own notifications, newest first.
// Nothing is ever deleted here — only "seen" changes.
// ---------------------------------------------------------------------------
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('notifications').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(400).json({ error: 'Impossible de charger les notifications.' });
  }

  res.json({ notifications: data });
});

// ---------------------------------------------------------------------------
// POST /notifications/seen — mark all of the caller's unseen notifications
// as seen. This only resets the unread COUNT; the notifications themselves
// stay in the list.
// ---------------------------------------------------------------------------
router.post('/seen', requireAuth, async (req, res) => {
  const { error } = await req.supabase.from('notifications').update({ seen: true }).eq('user_id', req.user.id).eq('seen', false);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Impossible de mettre à jour les notifications.' });
  }

  res.json({ success: true });
});

module.exports = router;