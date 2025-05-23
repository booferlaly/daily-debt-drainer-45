
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nebhefqshqndvplyzjwv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lYmhlZnFzaHFuZHZwbHl6and2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NDM4MTksImV4cCI6MjA2MjMxOTgxOX0.WMmShpVxgkXt0CdmVvgSCyMqRNz8WGCFUTsK_lnkPrs";

// A helper to get the current app URL for redirects
const getURL = () => {
  let url =
    import.meta.env?.VITE_SITE_URL ?? // Set this to your site URL in production env.
    window.location.origin;
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce',
    detectSessionInUrl: true,
  }
});
