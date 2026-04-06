import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeXRkYW10ZmlsbHF5a2xncm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNzk4ODAsImV4cCI6MjA4NTk1NTg4MH0.W1w_M7dQXgPehDP0NUWWE4QHcW214XGVRIVXtG5n9z4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
