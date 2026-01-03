export interface DentistData {
  id: string;
  name: string;
  specialization?: string;
  status: 'active' | 'inactive';
}

export interface DentistResponse {
  id: string;
  name: string;
  specialization: string | null;
  status: string;
  created_at: string;
}

const FUNCTION_URL = 'https://nmqkbmiqcycbfktjnbie.supabase.co/functions/v1/dentists';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcWtibWlxY3ljYmZrdGpuYmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODA0NDIsImV4cCI6MjA4Mjg1NjQ0Mn0.kDQYJFvk9i5pRMHO__FO2fQlS99wJ5JDU7Wm3isU_mI';

// Common headers for all requests
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${ANON_KEY}`,
  'apikey': ANON_KEY,
});

// Transform API response to frontend format
const transformDentist = (d: DentistResponse): DentistData => ({
  id: d.id,
  name: d.name,
  specialization: d.specialization || '',
  status: d.status as 'active' | 'inactive',
});

export const dentistsApi = {
  // Get all dentists
  async getAll() {
    const response = await fetch(FUNCTION_URL, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch dentists');
    }

    const result = await response.json();
    return (result.data || []).map(transformDentist);
  },

  // Get single dentist
  async getById(id: string) {
    const response = await fetch(`${FUNCTION_URL}?id=${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch dentist');
    }

    const result = await response.json();
    return result.data ? transformDentist(result.data) : null;
  },
};
