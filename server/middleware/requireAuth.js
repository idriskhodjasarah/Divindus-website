const { createClient } = require('@supabase/supabase-js');
const supabase = require('../supabaseClient');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non authentifié.' });
  }

  const token = authHeader.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Session invalide ou expirée.' });
  }

  req.user = data.user;
  req.token = token; // raw token, needed for direct Auth API calls like password changes
  req.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  next();
}

module.exports = { requireAuth };