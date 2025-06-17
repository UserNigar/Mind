import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Məqalələri gətir
export const fetchMyArticles = createAsyncThunk(
  "articles/fetchMyArticles",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5050/api/users/my-articles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Məqalələr yüklənə bilmədi.");
    }
  }
);

// Məqaləni sil
export const deleteArticle = createAsyncThunk(
  "articles/deleteArticle",
  async (id, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5050/api/users/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue("Məqalə silinə bilmədi.");
    }
  }
);

const articleSlice = createSlice({
  name: "articles",
  initialState: {
    myArticles: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyArticles.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchMyArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.myArticles = action.payload;
      })
      .addCase(fetchMyArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.myArticles = state.myArticles.filter((a) => a._id !== action.payload);
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default articleSlice.reducer;
