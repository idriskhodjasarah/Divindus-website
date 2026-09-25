const supabase = require('../supabaseClient');

// Reads the session token sent by the frontend (in the Authorization header),
// verifies it with Supabase, and attaches the logged-in user to req.user.
// Any route using this middleware can then trust req.user is a real, verified person.
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
  next();
}

module.exports = { requireAuth };