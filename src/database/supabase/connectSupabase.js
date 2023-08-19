import { createClient } from "@supabase/supabase-js";
import logger from "../../utility/logger.js";

export function connectSupabase() {
    const options = {
      db: {
        schema: "public",
      },
      auth: {
        persistSession: false,
        detectSessionInUrl: true,
      },
      global: {
        headers: { "x-application-name": "my-personal-trainer" },
      },
    };
  
    logger.info("Creating Supabase Client");
    const supabase = createClient(process.env.PERSONAL_TRAINER_SUPABASE_URL, process.env.PERSONAL_TRAINER_SUPABASE_SERVICE_KEY, options);
    return supabase;
  }