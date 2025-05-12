import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
}

export const fetchMe = createAsyncThunk<User, void>(
  'user/fetchMe',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return rejectWithValue('No access token');

    const projectKey = import.meta.env.VITE_CT_PROJECT_KEY;
    const apiUrl = import.meta.env.VITE_CT_API_URL;
    const url = `${apiUrl}/${projectKey}/me`;

    try {
      const resp = await axios.get<User>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return resp.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(e.response?.data?.message || e.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

const initialState = null as User | null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (): User | null => null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMe.fulfilled, (_state, action) => action.payload);
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
