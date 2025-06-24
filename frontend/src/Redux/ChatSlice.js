import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Asinxron thunk: mesajları DB-dən gətir
export const getMessagesFromDB = createAsyncThunk(
  "chat/getMessagesFromDB",
  async ({ from, to, token }, thunkAPI) => {
    try {
      const res = await axios.get(
        `http://localhost:5050/api/users/messages?from=${from}&to=${to}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Xəta baş verdi");
    }
  }
);

// Asinxron thunk: mesajı DB-yə yaz
export const sendMessageToDB = createAsyncThunk(
  "chat/sendMessageToDB",
  async ({ from, to, text, token }, thunkAPI) => {
    try {
      await axios.post(
        `http://localhost:5050/api/users/messages`,
        { from, to, text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { from, to, text }; // cavabı reducerə ötür
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Göndərmə xətası");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedUser: null,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessagesFromDB.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessagesFromDB.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getMessagesFromDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessageToDB.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { setSelectedUser, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
