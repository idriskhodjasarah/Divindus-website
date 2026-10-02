const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { requireAuth } = require('../middleware/requireAuth');

// ---------------------------------------------------------------------------
// GET /content — public, anyone can view (the landing page needs this
// before anyone logs in).
// ---------------------------------------------------------------------------
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('site_content').select('*').eq('id', 'main').single();

  if (error) {
    console.error(error);
    return res.status(400).json({ error: 'Impossible de charger le contenu du site.' });
  }

  res.json({ content: data });
});

// ---------------------------------------------------------------------------
// PUT /content — update the site's editable content (admin only, RLS-enforced).
// ---------------------------------------------------------------------------
router.put('/', requireAuth, async (req, res) => {
  const { hero_slides, footer, legal } = req.body;

  const { data, error } = await req.supabase
    .from('site_content')
    .update({ hero_slides, footer, legal, updated_at: new Date().toISOString() })
    .eq('id', 'main')
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(403).json({ error: 'Action réservée aux administrateurs.' });
  }

  res.json({ content: data });
});

module.exports = router;