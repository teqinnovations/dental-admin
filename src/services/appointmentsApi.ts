import { supabase } from '@/lib/supabase';

export interface AppointmentData {
  id?: string;
  patientId?: string;
  patientName: string;
  date: string;
  time: string;
  duration: number;
  type: 'checkup' | 'cleaning' | 'filling' | 'extraction' | 'root-canal' | 'crown' | 'other';
  dentist: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface AppointmentResponse {
  id: string;
  patient_id: string | null;
  patient_name: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  dentist: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const FUNCTION_URL = 'https://nmqkbmiqcycbfktjnbie.supabase.co/functions/v1/appointments';

// Transform API response to frontend format
const transformAppointment = (a: AppointmentResponse): AppointmentData & { id: string; createdAt: string } => ({
  id: a.id,
  patientId: a.patient_id || undefined,
  patientName: a.patient_name,
  date: a.date,
  time: a.time,
  duration: a.duration,
  type: a.type as AppointmentData['type'],
  dentist: a.dentist,
  status: a.status as AppointmentData['status'],
  notes: a.notes || '',
  createdAt: a.created_at,
});

export const appointmentsApi = {
  // Get all appointments
  async getAll() {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const response = await fetch(FUNCTION_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcWtibWlxY3ljYmZrdGpuYmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODA0NDIsImV4cCI6MjA4Mjg1NjQ0Mn0.kDQYJFvk9i5pRMHO__FO2fQlS99wJ5JDU7Wm3isU_mI',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch appointments');
    }

    const result = await response.json();
    return (result.data || []).map(transformAppointment);
  },

  // Get single appointment
  async getById(id: string) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const response = await fetch(`${FUNCTION_URL}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcWtibWlxY3ljYmZrdGpuYmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODA0NDIsImV4cCI6MjA4Mjg1NjQ0Mn0.kDQYJFvk9i5pRMHO__FO2fQlS99wJ5JDU7Wm3isU_mI',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch appointment');
    }

    const result = await response.json();
    return result.data ? transformAppointment(result.data) : null;
  },

  // Create appointment
  async create(appointment: AppointmentData) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcWtibWlxY3ljYmZrdGpuYmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODA0NDIsImV4cCI6MjA4Mjg1NjQ0Mn0.kDQYJFvk9i5pRMHO__FO2fQlS99wJ5JDU7Wm3isU_mI',
      },
      body: JSON.stringify(appointment),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create appointment');
    }

    const result = await response.json();
    return transformAppointment(result.data);
  },

  // Update appointment
  async update(id: string, appointment: AppointmentData) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const response = await fetch(`${FUNCTION_URL}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcWtibWlxY3ljYmZrdGpuYmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODA0NDIsImV4cCI6MjA4Mjg1NjQ0Mn0.kDQYJFvk9i5pRMHO__FO2fQlS99wJ5JDU7Wm3isU_mI',
      },
      body: JSON.stringify(appointment),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update appointment');
    }

    const result = await response.json();
    return transformAppointment(result.data);
  },

  // Delete appointment
  async delete(id: string) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const response = await fetch(`${FUNCTION_URL}?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcWtibWlxY3ljYmZrdGpuYmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODA0NDIsImV4cCI6MjA4Mjg1NjQ0Mn0.kDQYJFvk9i5pRMHO__FO2fQlS99wJ5JDU7Wm3isU_mI',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete appointment');
    }

    return true;
  },
};
