import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  insuranceProvider: string;
  insuranceId: string;
  lastVisit: string;
  nextAppointment: string | null;
  status: 'active' | 'inactive';
  notes: string;
  createdAt: string;
}

interface PatientsState {
  patients: Patient[];
  selectedPatient: Patient | null;
  searchQuery: string;
  filterStatus: 'all' | 'active' | 'inactive';
  isLoading: boolean;
}

const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-03-15',
    gender: 'female',
    address: '123 Oak Street, Springfield, IL 62701',
    insuranceProvider: 'Delta Dental',
    insuranceId: 'DD-123456',
    lastVisit: '2024-12-15',
    nextAppointment: '2025-01-05',
    status: 'active',
    notes: 'Regular cleaning patient. No allergies.',
    createdAt: '2023-01-10',
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@email.com',
    phone: '(555) 234-5678',
    dateOfBirth: '1978-07-22',
    gender: 'male',
    address: '456 Maple Avenue, Springfield, IL 62702',
    insuranceProvider: 'Cigna Dental',
    insuranceId: 'CG-789012',
    lastVisit: '2024-11-28',
    nextAppointment: '2025-01-10',
    status: 'active',
    notes: 'Crown work in progress. Sensitive to cold.',
    createdAt: '2022-05-20',
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '(555) 345-6789',
    dateOfBirth: '1992-11-08',
    gender: 'female',
    address: '789 Pine Road, Springfield, IL 62703',
    insuranceProvider: 'MetLife Dental',
    insuranceId: 'ML-345678',
    lastVisit: '2024-12-20',
    nextAppointment: null,
    status: 'active',
    notes: 'Wisdom teeth removal completed.',
    createdAt: '2023-08-15',
  },
  {
    id: '4',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@email.com',
    phone: '(555) 456-7890',
    dateOfBirth: '1965-04-30',
    gender: 'male',
    address: '321 Elm Court, Springfield, IL 62704',
    insuranceProvider: 'Aetna Dental',
    insuranceId: 'AE-901234',
    lastVisit: '2024-09-10',
    nextAppointment: null,
    status: 'inactive',
    notes: 'Moved to a different city.',
    createdAt: '2021-02-28',
  },
  {
    id: '5',
    firstName: 'Amanda',
    lastName: 'Thompson',
    email: 'amanda.thompson@email.com',
    phone: '(555) 567-8901',
    dateOfBirth: '1988-09-12',
    gender: 'female',
    address: '654 Cedar Lane, Springfield, IL 62705',
    insuranceProvider: 'Delta Dental',
    insuranceId: 'DD-567890',
    lastVisit: '2024-12-22',
    nextAppointment: '2025-01-08',
    status: 'active',
    notes: 'Orthodontic treatment ongoing.',
    createdAt: '2023-03-05',
  },
  {
    id: '6',
    firstName: 'David',
    lastName: 'Martinez',
    email: 'david.martinez@email.com',
    phone: '(555) 678-9012',
    dateOfBirth: '1975-12-05',
    gender: 'male',
    address: '987 Birch Boulevard, Springfield, IL 62706',
    insuranceProvider: 'Guardian Dental',
    insuranceId: 'GD-234567',
    lastVisit: '2024-12-18',
    nextAppointment: '2025-01-15',
    status: 'active',
    notes: 'Periodontal maintenance every 3 months.',
    createdAt: '2022-11-10',
  },
];

const initialState: PatientsState = {
  patients: mockPatients,
  selectedPatient: null,
  searchQuery: '',
  filterStatus: 'all',
  isLoading: false,
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
    },
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.unshift(action.payload);
    },
    updatePatient: (state, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
    deletePatient: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter(p => p.id !== action.payload);
    },
    setSelectedPatient: (state, action: PayloadAction<Patient | null>) => {
      state.selectedPatient = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<'all' | 'active' | 'inactive'>) => {
      state.filterStatus = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setPatients,
  addPatient,
  updatePatient,
  deletePatient,
  setSelectedPatient,
  setSearchQuery,
  setFilterStatus,
  setLoading,
} = patientsSlice.actions;

export default patientsSlice.reducer;
