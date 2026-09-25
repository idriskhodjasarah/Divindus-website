const { createClient } = require('@supabase/supabase-js');
const supabase = require('../supabaseClient');

// Reads the session token sent by the frontend (in the Authorization header),
// verifies it with Supabase, and attaches:
//   req.user      → the logged-in user's basic info
//   req.supabase  → a Supabase client that acts AS that user, so every query
//                   it makes is automatically checked against your RLS policies
//                   (e.g. only admins can insert into "products").
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization; // expected format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non authentifié.' });
  }

  const token = authHeader.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Session invalide ou expirée.' });
  }

  req.user = data.user;
  req.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  next();
}

module.exports = { requireAuth };