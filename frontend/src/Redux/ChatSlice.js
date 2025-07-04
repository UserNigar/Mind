import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


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
      return { from, to, text };
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
    unreadCounts: {},  
    lastMessages: {},   
    readMessages: [],    
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = [];


      if (state.unreadCounts[action.payload]) {
        delete state.unreadCounts[action.payload];
      }


      if (!state.readMessages.includes(action.payload)) {
        state.readMessages.push(action.payload);
      }
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);

      const { from, to, text } = action.payload;

   
      state.lastMessages[from] = text;
      state.lastMessages[to] = text;


      if (state.selectedUser !== from) {
        if (state.unreadCounts[from]) {
          state.unreadCounts[from]++;
        } else {
          state.unreadCounts[from] = 1;
        }
      }
    },

    clearUnread: (state, action) => {
      delete state.unreadCounts[action.payload];
    },

    incrementUnread: (state, action) => {
      const user = action.payload;
      if (state.unreadCounts[user]) {
        state.unreadCounts[user]++;
      } else {
        state.unreadCounts[user] = 1;
      }
    },

    resetUnread: (state, action) => {
      const user = action.payload;
      if (state.unreadCounts[user]) {
        delete state.unreadCounts[user];
      }
    },


    markMessagesAsRead: (state, action) => {
      const username = action.payload;
      if (!state.readMessages.includes(username)) {
        state.readMessages.push(username);
      }
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


export const {
  setSelectedUser,
  addMessage,
  clearUnread,
  incrementUnread,
  resetUnread,
  markMessagesAsRead,
} = chatSlice.actions;

export default chatSlice.reducer;
