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

    console.log(`[Appointments] ${method} request received at ${new Date().toISOString()}`);
    console.log(`[Appointments] URL: ${req.url}`);

    // GET - List all appointments or get single appointment
    if (method === 'GET') {
      const appointmentId = url.searchParams.get('id');
      
      if (appointmentId) {
        console.log(`[Appointments] Fetching appointment with id: ${appointmentId}`);
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', appointmentId)
          .maybeSingle();

        if (error) {
          console.error('[Appointments] Error fetching appointment:', error);
          throw error;
        }

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('[Appointments] Fetching all appointments');
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error('[Appointments] Error fetching appointments:', error);
        throw error;
      }

      console.log(`[Appointments] Found ${data?.length || 0} appointments`);
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST - Create new appointment
    if (method === 'POST') {
      const body = await req.json();
      console.log('[Appointments] Creating new appointment:', body);

      // Check for slot availability (same date, time, and dentist)
      const { data: existingAppointments, error: checkError } = await supabase
        .from('appointments')
        .select('id, patient_name, dentist')
        .eq('date', body.date)
        .eq('time', body.time)
        .eq('dentist_id', body.dentistId)
        .neq('status', 'cancelled');

      if (checkError) {
        console.error('[Appointments] Error checking slot availability:', checkError);
        throw checkError;
      }

      if (existingAppointments && existingAppointments.length > 0) {
        console.log('[Appointments] Slot already booked:', existingAppointments);
        return new Response(JSON.stringify({ 
          error: 'Please choose another time/slot - this is already booked' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 409,
        });
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: body.patientId,
          patient_name: body.patientName,
          date: body.date,
          time: body.time,
          duration: body.duration || 30,
          type: body.type,
          dentist_id: body.dentistId,
          dentist: body.dentist,
          status: body.status || 'scheduled',
          notes: body.notes,
        }])
        .select()
        .single();

      if (error) {
        console.error('[Appointments] Error creating appointment:', error);
        throw error;
      }

      console.log('[Appointments] Appointment created successfully:', data.id);
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    // PUT - Update appointment
    if (method === 'PUT') {
      const body = await req.json();
      const appointmentId = url.searchParams.get('id');

      if (!appointmentId) {
        return new Response(JSON.stringify({ error: 'Appointment ID is required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      console.log(`[Appointments] Updating appointment ${appointmentId}:`, body);

      // Check for slot availability (same date, time, and dentist, excluding current appointment)
      const { data: existingAppointments, error: checkError } = await supabase
        .from('appointments')
        .select('id, patient_name, dentist')
        .eq('date', body.date)
        .eq('time', body.time)
        .eq('dentist_id', body.dentistId)
        .neq('id', appointmentId)
        .neq('status', 'cancelled');

      if (checkError) {
        console.error('[Appointments] Error checking slot availability:', checkError);
        throw checkError;
      }

      if (existingAppointments && existingAppointments.length > 0) {
        console.log('[Appointments] Slot already booked:', existingAppointments);
        return new Response(JSON.stringify({ 
          error: 'Please choose another time/slot - this is already booked' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 409,
        });
      }

      const { data, error } = await supabase
        .from('appointments')
        .update({
          patient_id: body.patientId,
          patient_name: body.patientName,
          date: body.date,
          time: body.time,
          duration: body.duration,
          type: body.type,
          dentist_id: body.dentistId,
          dentist: body.dentist,
          status: body.status,
          notes: body.notes,
        })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) {
        console.error('[Appointments] Error updating appointment:', error);
        throw error;
      }

      console.log('[Appointments] Appointment updated successfully');
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE - Delete appointment
    if (method === 'DELETE') {
      const appointmentId = url.searchParams.get('id');

      if (!appointmentId) {
        return new Response(JSON.stringify({ error: 'Appointment ID is required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      console.log(`[Appointments] Deleting appointment ${appointmentId}`);

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) {
        console.error('[Appointments] Error deleting appointment:', error);
        throw error;
      }

      console.log('[Appointments] Appointment deleted successfully');
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });

  } catch (error) {
    console.error('[Appointments] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
