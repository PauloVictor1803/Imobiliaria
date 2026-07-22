import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hxneerzmgtfwxxityitv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bmVlcnptZ3Rmd3h4aXR5aXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NzI2NDEsImV4cCI6MjEwMDI0ODY0MX0.D89yPDkK-6zJcCl4NxC_NuZinuE89TN_PAb2oPXXy7k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
