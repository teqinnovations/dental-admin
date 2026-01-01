import { configureStore } from '@reduxjs/toolkit';
import patientsReducer from './slices/patientsSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import reportsReducer from './slices/reportsSlice';
import gmailReducer from './slices/gmailSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    patients: patientsReducer,
    appointments: appointmentsReducer,
    reports: reportsReducer,
    gmail: gmailReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
