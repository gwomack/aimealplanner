// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eoyebziilbywyujatwhb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVveWViemlpbGJ5d3l1amF0d2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMDI1MDQsImV4cCI6MjA1MTU3ODUwNH0.pcQiym2o9Oc1M6u9mM1Zlco4UqvcT6NJzkTBuxUrorw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);