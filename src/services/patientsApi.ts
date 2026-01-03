export interface PatientData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  insuranceProvider?: string;
  insuranceId?: string;
  medicalHistory?: string;
  allergies?: string;
  status: 'active' | 'inactive';
  lastVisit?: string;
}

export interface PatientResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  insurance_provider: string | null;
  insurance_id: string | null;
  medical_history: string | null;
  allergies: string | null;
  status: string;
  last_visit: string | null;
  created_at: string;
}

const FUNCTION_URL = 'https://nmqkbmiqcycbfktjnbie.supabase.co/functions/v1/patients';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcWtibWlxY3ljYmZrdGpuYmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODA0NDIsImV4cCI6MjA4Mjg1NjQ0Mn0.kDQYJFvk9i5pRMHO__FO2fQlS99wJ5JDU7Wm3isU_mI';

// Common headers for all requests (no JWT required since functions use --no-verify-jwt)
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'apikey': ANON_KEY,
});

// Transform API response to frontend format
const transformPatient = (p: PatientResponse): PatientData & { id: string } => ({
  id: p.id,
  name: p.name,
  email: p.email,
  phone: p.phone,
  dateOfBirth: p.date_of_birth,
  address: p.address,
  insuranceProvider: p.insurance_provider || '',
  insuranceId: p.insurance_id || '',
  medicalHistory: p.medical_history || '',
  allergies: p.allergies || '',
  status: p.status as 'active' | 'inactive',
  lastVisit: p.last_visit || '',
});

export const patientsApi = {
  // Get all patients
  async getAll() {
    const response = await fetch(FUNCTION_URL, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch patients');
    }

    const result = await response.json();
    return (result.data || []).map(transformPatient);
  },

  // Get single patient
  async getById(id: string) {
    const response = await fetch(`${FUNCTION_URL}?id=${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch patient');
    }

    const result = await response.json();
    return result.data ? transformPatient(result.data) : null;
  },

  // Create patient
  async create(patient: PatientData) {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(patient),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create patient');
    }

    const result = await response.json();
    return transformPatient(result.data);
  },

  // Update patient
  async update(id: string, patient: PatientData) {
    const response = await fetch(`${FUNCTION_URL}?id=${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(patient),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update patient');
    }

    const result = await response.json();
    return transformPatient(result.data);
  },

  // Delete patient
  async delete(id: string) {
    const response = await fetch(`${FUNCTION_URL}?id=${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete patient');
    }

    return true;
  },
};
