require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
 
// This client uses the SECRET key and bypasses Row Level Security entirely.
// It must NEVER be imported into any frontend code — server-side only.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);
 
module.exports = supabaseAdmin;
 