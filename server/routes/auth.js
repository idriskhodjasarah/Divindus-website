const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');       // public client, respects RLS
const supabaseAdmin = require('../supabaseAdmin');    // secret-key client, bypasses RLS
const { requireAuth } = require('../middleware/requireAuth');
// ---------------------------------------------------------------------------
// POST /auth/register
// Creates the auth user (unconfirmed) + their profile row.
// Supabase automatically emails a confirmation code to the address given.
// ---------------------------------------------------------------------------
router.post('/register', async (req, res) => {
  const { email, password, prenom, nom, telephone, adresse } = req.body;

  if (!email || !password || !prenom || !nom) {
    return res.status(400).json({ error: 'Champs manquants.' });
  }

  // Creates the user but leaves them unconfirmed — they must verify via code first.
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Create the matching profile row right away, using the new user's id.
  const { error: profileError } = await supabaseAdmin.from('profiles').insert({
    id: data.user.id,
    prenom,
    nom,
    email,
    telephone,
    adresse,
    is_admin: false,
  });

  if (profileError) {
    return res.status(400).json({ error: profileError.message });
  }

  // Trigger Supabase's built-in confirmation email (contains the OTP code).
  await supabase.auth.resend({ type: 'signup', email });

  res.json({ message: 'Compte créé, code de vérification envoyé.' });
});

// ---------------------------------------------------------------------------
// POST /auth/verify
// Confirms the signup code the user received by email, and logs them in.
// ---------------------------------------------------------------------------
router.post('/verify', async (req, res) => {
  const { email, code } = req.body;

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'signup',
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ session: data.session, user: data.user });
});

// ---------------------------------------------------------------------------
// POST /auth/login
// ---------------------------------------------------------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(400).json({ error: 'Email ou mot de passe incorrect.' });
  }

  // Fetch the matching profile row, which tells us if this is an admin.
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    return res.status(400).json({ error: 'Profil introuvable.' });
  }

  res.json({ session: data.session, profile });
});

// ---------------------------------------------------------------------------
// GET /auth/me
// Returns the currently logged-in user's profile, given a valid session token.
// ---------------------------------------------------------------------------
router.get('/me', requireAuth, async (req, res) => {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) {
    return res.status(400).json({ error: 'Profil introuvable.' });
  }

  res.json({ profile });
});

module.exports = router;