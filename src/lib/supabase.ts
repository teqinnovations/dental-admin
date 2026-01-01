import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovkdhyvvovwerepgbpoy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92a2RoeXZ2b3Z3ZXJlcGdicG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzMzNzMsImV4cCI6MjA4Mjg0OTM3M30.Liv-jgVbihbQwi-F2JW6DePn81tnrWwZ72Dkx0qB7QI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
