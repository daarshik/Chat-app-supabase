import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  "https://pycxbtozlgzltxjddocn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5Y3hidG96bGd6bHR4amRkb2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MzgyNzIsImV4cCI6MjA2MzQxNDI3Mn0.uaiTGy5iXiHVmdffapkLkXu3OmNIonFiDFCd6ReYdmw"
);
