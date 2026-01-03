import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const method = req.method;

    console.log(`[Dentists] ${method} request received at ${new Date().toISOString()}`);

    // GET - List all dentists
    if (method === 'GET') {
      const dentistId = url.searchParams.get('id');
      
      if (dentistId) {
        console.log(`[Dentists] Fetching dentist with id: ${dentistId}`);
        const { data, error } = await supabase
          .from('dentists')
          .select('*')
          .eq('id', dentistId)
          .maybeSingle();

        if (error) {
          console.error('[Dentists] Error fetching dentist:', error);
          throw error;
        }

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('[Dentists] Fetching all dentists');
      const { data, error } = await supabase
        .from('dentists')
        .select('*')
        .eq('status', 'active')
        .order('name', { ascending: true });

      if (error) {
        console.error('[Dentists] Error fetching dentists:', error);
        throw error;
      }

      console.log(`[Dentists] Found ${data?.length || 0} dentists`);
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });

  } catch (error) {
    console.error('[Dentists] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
