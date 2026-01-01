import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ReportData {
  monthlyRevenue: { month: string; revenue: number; target: number }[];
  appointmentsByType: { type: string; count: number; percentage: number }[];
  patientGrowth: { month: string; newPatients: number; totalPatients: number }[];
  appointmentStatus: { status: string; count: number }[];
  revenueByService: { service: string; revenue: number }[];
  weeklyAppointments: { day: string; count: number }[];
}

interface ReportsState {
  data: ReportData;
  dateRange: { start: string; end: string };
  selectedReport: 'revenue' | 'appointments' | 'patients' | 'overview';
  isLoading: boolean;
}

const mockReportData: ReportData = {
  monthlyRevenue: [
    { month: 'Jul', revenue: 42500, target: 45000 },
    { month: 'Aug', revenue: 48200, target: 45000 },
    { month: 'Sep', revenue: 51800, target: 50000 },
    { month: 'Oct', revenue: 47300, target: 50000 },
    { month: 'Nov', revenue: 53100, target: 52000 },
    { month: 'Dec', revenue: 58400, target: 55000 },
  ],
  appointmentsByType: [
    { type: 'Cleaning', count: 145, percentage: 35 },
    { type: 'Checkup', count: 98, percentage: 24 },
    { type: 'Filling', count: 67, percentage: 16 },
    { type: 'Crown', count: 45, percentage: 11 },
    { type: 'Root Canal', count: 32, percentage: 8 },
    { type: 'Other', count: 25, percentage: 6 },
  ],
  patientGrowth: [
    { month: 'Jul', newPatients: 28, totalPatients: 1234 },
    { month: 'Aug', newPatients: 35, totalPatients: 1269 },
    { month: 'Sep', newPatients: 42, totalPatients: 1311 },
    { month: 'Oct', newPatients: 31, totalPatients: 1342 },
    { month: 'Nov', newPatients: 38, totalPatients: 1380 },
    { month: 'Dec', newPatients: 45, totalPatients: 1425 },
  ],
  appointmentStatus: [
    { status: 'Completed', count: 312 },
    { status: 'Scheduled', count: 87 },
    { status: 'Cancelled', count: 23 },
    { status: 'No-show', count: 8 },
  ],
  revenueByService: [
    { service: 'Preventive Care', revenue: 125000 },
    { service: 'Restorative', revenue: 98000 },
    { service: 'Cosmetic', revenue: 67000 },
    { service: 'Orthodontics', revenue: 45000 },
    { service: 'Emergency', revenue: 23000 },
  ],
  weeklyAppointments: [
    { day: 'Mon', count: 18 },
    { day: 'Tue', count: 22 },
    { day: 'Wed', count: 25 },
    { day: 'Thu', count: 20 },
    { day: 'Fri', count: 15 },
  ],
};

const initialState: ReportsState = {
  data: mockReportData,
  dateRange: {
    start: '2024-07-01',
    end: '2024-12-31',
  },
  selectedReport: 'overview',
  isLoading: false,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReportData: (state, action: PayloadAction<ReportData>) => {
      state.data = action.payload;
    },
    setDateRange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.dateRange = action.payload;
    },
    setSelectedReport: (state, action: PayloadAction<'revenue' | 'appointments' | 'patients' | 'overview'>) => {
      state.selectedReport = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setReportData,
  setDateRange,
  setSelectedReport,
  setLoading,
} = reportsSlice.actions;

export default reportsSlice.reducer;
