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

    console.log(`[Patients] ${method} request received at ${new Date().toISOString()}`);
    console.log(`[Patients] URL: ${req.url}`);

    // GET - List all patients or get single patient
    if (method === 'GET') {
      const patientId = url.searchParams.get('id');
      
      if (patientId) {
        console.log(`[Patients] Fetching patient with id: ${patientId}`);
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .maybeSingle();

        if (error) {
          console.error('[Patients] Error fetching patient:', error);
          throw error;
        }

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('[Patients] Fetching all patients');
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Patients] Error fetching patients:', error);
        throw error;
      }

      console.log(`[Patients] Found ${data?.length || 0} patients`);
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST - Create new patient
    if (method === 'POST') {
      const body = await req.json();
      console.log('[Patients] Creating new patient:', body);

      const { data, error } = await supabase
        .from('patients')
        .insert([{
          name: body.name,
          email: body.email,
          phone: body.phone,
          date_of_birth: body.dateOfBirth,
          address: body.address,
          insurance_provider: body.insuranceProvider,
          insurance_id: body.insuranceId,
          medical_history: body.medicalHistory,
          allergies: body.allergies,
          status: body.status || 'active',
          last_visit: body.lastVisit,
        }])
        .select()
        .single();

      if (error) {
        console.error('[Patients] Error creating patient:', error);
        throw error;
      }

      console.log('[Patients] Patient created successfully:', data.id);
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    // PUT - Update patient
    if (method === 'PUT') {
      const body = await req.json();
      const patientId = url.searchParams.get('id');

      if (!patientId) {
        return new Response(JSON.stringify({ error: 'Patient ID is required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      console.log(`[Patients] Updating patient ${patientId}:`, body);

      const { data, error } = await supabase
        .from('patients')
        .update({
          name: body.name,
          email: body.email,
          phone: body.phone,
          date_of_birth: body.dateOfBirth,
          address: body.address,
          insurance_provider: body.insuranceProvider,
          insurance_id: body.insuranceId,
          medical_history: body.medicalHistory,
          allergies: body.allergies,
          status: body.status,
          last_visit: body.lastVisit,
        })
        .eq('id', patientId)
        .select()
        .single();

      if (error) {
        console.error('[Patients] Error updating patient:', error);
        throw error;
      }

      console.log('[Patients] Patient updated successfully');
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE - Delete patient
    if (method === 'DELETE') {
      const patientId = url.searchParams.get('id');

      if (!patientId) {
        return new Response(JSON.stringify({ error: 'Patient ID is required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      console.log(`[Patients] Deleting patient ${patientId}`);

      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId);

      if (error) {
        console.error('[Patients] Error deleting patient:', error);
        throw error;
      }

      console.log('[Patients] Patient deleted successfully');
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });

  } catch (error) {
    console.error('[Patients] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
