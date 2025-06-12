import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  users: [],
  currentUser: null,
  token: null,
  status: 'idle',
  error: null,
};

const base_URL = 'http://localhost:5050/api/users';

// İstifadəçiləri almaq
export const getUsers = createAsyncThunk('users/getUsers', async () => {
  const res = await axios.get(base_URL);
  return res.data;
});

// İstifadəçi yaratmaq
export const createUsers = createAsyncThunk('users/add', async (user, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(base_URL, user, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  } catch (error) {
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue(error.message || 'Kullanıcı oluşturulurken hata oluştu.');
  }
});

// Giriş funksiyası (düzəldilmiş)
export const loginUser = createAsyncThunk('users/login', async (user, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('http://localhost:5050/api/users/login', user);
    return data; // Bütün cavabı qaytar (user və token daxil olmaqla)
  } catch (error) {
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue(error.message || 'Giriş yapılırken hata oluştu.');
  }
});

// Slice
export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getUsers
      .addCase(getUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
        state.error = null;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // createUsers
      .addCase(createUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (Array.isArray(state.users)) {
          state.users.push(action.payload);
        } else {
          state.users = [action.payload];
        }
        state.error = null;
      })
      .addCase(createUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // loginUser (düzgün tokenlə)
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logoutUser, clearUserError } = userSlice.actions;
export default userSlice.reducer;
