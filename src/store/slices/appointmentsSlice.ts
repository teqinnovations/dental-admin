import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'checkup' | 'cleaning' | 'filling' | 'extraction' | 'root-canal' | 'crown' | 'other';
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

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    date: '2025-01-05',
    time: '09:00',
    duration: 60,
    type: 'cleaning',
    dentist: 'Dr. Smith',
    status: 'confirmed',
    notes: 'Regular 6-month cleaning',
    createdAt: '2024-12-01',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Michael Chen',
    date: '2025-01-05',
    time: '10:30',
    duration: 90,
    type: 'crown',
    dentist: 'Dr. Smith',
    status: 'scheduled',
    notes: 'Crown fitting appointment',
    createdAt: '2024-12-05',
  },
  {
    id: '3',
    patientId: '5',
    patientName: 'Amanda Thompson',
    date: '2025-01-08',
    time: '14:00',
    duration: 30,
    type: 'checkup',
    dentist: 'Dr. Johnson',
    status: 'confirmed',
    notes: 'Orthodontic progress check',
    createdAt: '2024-12-10',
  },
  {
    id: '4',
    patientId: '6',
    patientName: 'David Martinez',
    date: '2025-01-10',
    time: '11:00',
    duration: 45,
    type: 'cleaning',
    dentist: 'Dr. Smith',
    status: 'scheduled',
    notes: 'Periodontal maintenance',
    createdAt: '2024-12-12',
  },
  {
    id: '5',
    patientId: '3',
    patientName: 'Emily Rodriguez',
    date: '2025-01-02',
    time: '15:30',
    duration: 60,
    type: 'filling',
    dentist: 'Dr. Johnson',
    status: 'completed',
    notes: 'Cavity filling - upper left molar',
    createdAt: '2024-12-20',
  },
  {
    id: '6',
    patientId: '1',
    patientName: 'Sarah Johnson',
    date: '2025-01-03',
    time: '09:00',
    duration: 30,
    type: 'checkup',
    dentist: 'Dr. Smith',
    status: 'completed',
    notes: 'Follow-up consultation',
    createdAt: '2024-12-22',
  },
  {
    id: '7',
    patientId: '4',
    patientName: 'James Wilson',
    date: '2024-12-28',
    time: '16:00',
    duration: 45,
    type: 'extraction',
    dentist: 'Dr. Johnson',
    status: 'cancelled',
    notes: 'Patient cancelled - relocated',
    createdAt: '2024-12-15',
  },
  {
    id: '8',
    patientId: '2',
    patientName: 'Michael Chen',
    date: '2025-01-15',
    time: '13:00',
    duration: 60,
    type: 'root-canal',
    dentist: 'Dr. Smith',
    status: 'scheduled',
    notes: 'Root canal treatment',
    createdAt: '2024-12-28',
  },
];

const initialState: AppointmentsState = {
  appointments: mockAppointments,
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
