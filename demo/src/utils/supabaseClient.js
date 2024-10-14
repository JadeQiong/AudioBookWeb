import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qgvsvnihiwyydlxspvaz.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndnN2bmloaXd5eWRseHNwdmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc5MzY1ODQsImV4cCI6MjA0MzUxMjU4NH0.Ev2vnNLjC1GBU4Ro1SeZJs28Cntrn8AKAcK0TcUYnqo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
