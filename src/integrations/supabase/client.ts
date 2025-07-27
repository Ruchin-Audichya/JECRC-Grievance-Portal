import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://hhofvgpwjkygshussumk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhob2Z2Z3B3amt5Z3NodXNzdW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MDgxMTIsImV4cCI6MjA2OTE4NDExMn0.BaLpDNU_HKVsXYSZJj4RF0QDoCvWUSTuUuKKGM8TYh8';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});