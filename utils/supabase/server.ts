import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aphczgukfgfbvgjwferw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaGN6Z3VrZmdmYnZnandmZXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NjgwMDUsImV4cCI6MjA3MjQ0NDAwNX0.tXIzkswYNSdymavpJEJ-XE7p6cYdZIIMSOfmxqihicg';

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
}
