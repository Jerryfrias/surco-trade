import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://skpajixmptawfdmlrfam.supabase.co";
const supabaseKey = "sb_publishable_-TuXdzdWGgxgyhgLhn9ROg_lvHCt5D2";

export const supabase = createClient(supabaseUrl, supabaseKey);