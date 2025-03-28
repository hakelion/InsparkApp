import { createClient } from '@supabase/supabase-js';

// Regular client with anon key for CRUD operations
export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

// Admin client with service key for auth operations
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SERVICE_KEY || ''
); 