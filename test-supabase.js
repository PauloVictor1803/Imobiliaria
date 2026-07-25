import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxneerzmgtfwxxityitv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bmVlcnptZ3Rmd3h4aXR5aXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NzI2NDEsImV4cCI6MjEwMDI0ODY0MX0.D89yPDkK-6zJcCl4NxC_NuZinuE89TN_PAb2oPXXy7k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from("properties").select("*");
  console.log("Data:", data);
  console.log("Error:", error);
}

test();
