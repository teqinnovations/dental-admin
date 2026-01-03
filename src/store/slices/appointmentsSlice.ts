import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'checkup' | 'cleaning' | 'filling' | 'extraction' | 'root-canal' | 'crown' | 'other';
  dentistId: string;
  dentist: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  createdAt: string;
}

interface AppointmentsState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  selectedDate: string;
  viewMode: 'list' | 'calendar';
  filterStatus: 'all' | 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  isLoading: boolean;
}

const initialState: AppointmentsState = {
  appointments: [],
  selectedAppointment: null,
  selectedDate: new Date().toISOString().split('T')[0],
  viewMode: 'list',
  filterStatus: 'all',
  isLoading: false,
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.unshift(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(a => a.id !== action.payload);
    },
    setSelectedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.selectedAppointment = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'list' | 'calendar'>) => {
      state.viewMode = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<'all' | 'scheduled' | 'confirmed' | 'completed' | 'cancelled'>) => {
      state.filterStatus = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  setSelectedAppointment,
  setSelectedDate,
  setViewMode,
  setFilterStatus,
  setLoading,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
