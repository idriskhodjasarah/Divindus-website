const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');       // public client, respects RLS
const supabaseAdmin = require('../supabaseAdmin');    // secret-key client, bypasses RLS
const { requireAuth } = require('../middleware/requireAuth');
const { createClient } = require('@supabase/supabase-js');
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
// ---------------------------------------------------------------------------
// PATCH /auth/profile
// Updates the caller's own profile row. Used by both the client's "Mon
// compte" page and the admin's "Mon profil" page.
// ---------------------------------------------------------------------------
router.patch('/profile', requireAuth, async (req, res) => {
  const { prenom, nom, telephone, adresse, photo } = req.body;

  const { data, error } = await req.supabase
    .from('profiles')
    .update({ prenom, nom, telephone, adresse, photo })
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: 'Impossible de mettre à jour le profil.' });
  }

  res.json({ profile: data });
});

// ---------------------------------------------------------------------------
// POST /auth/change-password
// Requires the CURRENT password to prove it's really the account owner
// (Supabase has no "verify without logging in" call, so we simply attempt a
// real sign-in with it — if that fails, the current password was wrong).
// ---------------------------------------------------------------------------
router.post('/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Merci de remplir tous les champs.' });
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: req.user.email,
    password: currentPassword,
  });

  if (signInError) {
    return res.status(400).json({ error: 'Mot de passe actuel incorrect.' });
  }

  const { error } = await req.supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: 'Mot de passe mis à jour.' });
});
// ---------------------------------------------------------------------------
// POST /auth/forgot-password
// Sends a real recovery email. The link inside sends the browser back to
// CLIENT_URL with a token in the URL — the client reads it and shows
// ResetPassword, which calls /auth/reset-password below with that token.
// ---------------------------------------------------------------------------
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: clientUrl,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: 'Lien de réinitialisation envoyé.' });
});

// ---------------------------------------------------------------------------
// POST /auth/forgot-password
// Sends a real recovery email. The link inside sends the browser back to
// CLIENT_URL with a token in the URL — the client reads it and shows
// ResetPassword, which calls /auth/reset-password below with that token.
// ---------------------------------------------------------------------------
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: clientUrl,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: 'Lien de réinitialisation envoyé.' });
});

// ---------------------------------------------------------------------------
// POST /auth/reset-password
// Sets a new password using the recovery token from the email link.
// Builds a one-off client "acting as" that token, same trick used in
// requireAuth for regular requests.
// ---------------------------------------------------------------------------
router.post('/reset-password', async (req, res) => {
  const { access_token, password } = req.body;

  if (!access_token || !password) {
    return res.status(400).json({ error: 'Lien invalide.' });
  }

  // supabase-js's auth.updateUser() expects a full session object, not just a
  // header — for a one-off recovery token like this, calling Supabase's Auth
  // API directly is the reliable way to apply it.
  const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
    method: 'PUT',
    headers: {
      apikey: process.env.SUPABASE_KEY,
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    console.error('reset-password failed:', response.status, body);
    return res.status(400).json({ error: "Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré." });
  }

  res.json({ message: 'Mot de passe mis à jour.' });
});
module.exports = router;