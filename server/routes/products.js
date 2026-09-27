const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient'); // public client, respects RLS
const { requireAuth } = require('../middleware/requireAuth');

// ---------------------------------------------------------------------------
// GET /products — public, anyone can view (no login required)
// ---------------------------------------------------------------------------
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*').order('created_at');

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ products: data });
});

// ---------------------------------------------------------------------------
// POST /products — create a product.
// Uses req.supabase (the user-scoped client from requireAuth), so the
// database's own "Admins can insert products" RLS policy does the actual
// permission check — a non-admin gets rejected by Postgres itself.
// ---------------------------------------------------------------------------
router.post('/', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('products').insert(req.body).select().single();

  if (error) {
    console.error(error);
    return res.status(403).json({ error: "Action réservée aux administrateurs, ou données invalides." });
  }

  res.json({ product: data });
});

// ---------------------------------------------------------------------------
// PUT /products/:id — update a product (admin only, enforced by RLS)
// ---------------------------------------------------------------------------
router.put('/:id', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('products')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    return res.status(403).json({ error: "Action réservée aux administrateurs, ou produit introuvable." });
  }

  res.json({ product: data });
});

// ---------------------------------------------------------------------------
// DELETE /products/:id — remove a product (admin only, enforced by RLS)
// ---------------------------------------------------------------------------
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await req.supabase.from('products').delete().eq('id', req.params.id);

  if (error) {
    return res.status(403).json({ error: "Action réservée aux administrateurs." });
  }

  res.json({ success: true });
});

module.exports = router;