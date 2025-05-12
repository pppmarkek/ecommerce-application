import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Customer {
  id: string;
  email: string;
}

export const fetchMe = createAsyncThunk<Customer, void>(
  'user/fetchMe',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return rejectWithValue('No access token');
    }
    const projectKey = import.meta.env.VITE_CT_PROJECT_KEY;
    const apiUrl     = import.meta.env.VITE_CT_API_URL;
    const url        = `${apiUrl}/${projectKey}/me`;

    try {
      const resp = await axios.get<Customer>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return resp.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

interface UserState {
  customer: Customer | null;
}

const initialState: UserState = {
  customer: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearCustomer: state => {
      state.customer = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchMe.fulfilled, (state, { payload }) => {
      state.customer = payload;
    });
  },
});

export const { clearCustomer } = userSlice.actions;
export default userSlice.reducer;
