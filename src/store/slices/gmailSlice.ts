import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GmailState {
  isConnected: boolean;
  email: string | null;
  lastSynced: string | null;
  isConnecting: boolean;
  suggestedEmails: string[];
}

const mockSuggestedEmails = [
  'sarah.johnson@email.com',
  'michael.chen@email.com',
  'emily.rodriguez@email.com',
  'james.wilson@email.com',
  'amanda.thompson@email.com',
  'david.martinez@email.com',
  'info@deltadentalinsurance.com',
  'claims@cignadental.com',
  'support@metlifedental.com',
];

const initialState: GmailState = {
  isConnected: false,
  email: null,
  lastSynced: null,
  isConnecting: false,
  suggestedEmails: mockSuggestedEmails,
};

const gmailSlice = createSlice({
  name: 'gmail',
  initialState,
  reducers: {
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.isConnecting = action.payload;
    },
    connectGmail: (state, action: PayloadAction<string>) => {
      state.isConnected = true;
      state.email = action.payload;
      state.lastSynced = new Date().toISOString();
      state.isConnecting = false;
    },
    disconnectGmail: (state) => {
      state.isConnected = false;
      state.email = null;
      state.lastSynced = null;
    },
    updateLastSynced: (state) => {
      state.lastSynced = new Date().toISOString();
    },
    filterSuggestedEmails: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase();
      if (query.length === 0) {
        state.suggestedEmails = mockSuggestedEmails;
      } else {
        state.suggestedEmails = mockSuggestedEmails.filter(email =>
          email.toLowerCase().includes(query)
        );
      }
    },
  },
});

export const {
  setConnecting,
  connectGmail,
  disconnectGmail,
  updateLastSynced,
  filterSuggestedEmails,
} = gmailSlice.actions;

export default gmailSlice.reducer;
