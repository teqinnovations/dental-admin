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

const initialState: PatientsState = {
  patients: [],
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
