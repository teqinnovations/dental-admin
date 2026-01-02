import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nmqkbmiqcycbfktjnbie.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcWtibWlxY3ljYmZrdGpuYmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODA0NDIsImV4cCI6MjA4Mjg1NjQ0Mn0.kDQYJFvk9i5pRMHO__FO2fQlS99wJ5JDU7Wm3isU_mI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
