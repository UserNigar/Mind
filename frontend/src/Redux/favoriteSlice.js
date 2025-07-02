import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Kaydedilmiş məqalələri gətir
export const fetchSavedArticles = createAsyncThunk(
  "favorite/fetchSavedArticles",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5050/api/users/saved-articles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data; // saved articles array
    } catch (err) {
      return thunkAPI.rejectWithValue("Kaydedilmiş məqalələr yüklənə bilmədi.");
    }
  }
);

// Məqaləni kaydet/kayddan çıxart (toggle save)
export const toggleSaveArticle = createAsyncThunk(
  "favorite/toggleSaveArticle",
  async (articleId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.patch(
        `http://localhost:5050/api/users/articles/${articleId}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.savedArticles; // yeni saved list qaytarılır
    } catch (err) {
      return rejectWithValue("Məqalə kaydedilə bilmədi.");
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    savedArticles: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedArticles.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchSavedArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.savedArticles = action.payload;
      })
      .addCase(fetchSavedArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleSaveArticle.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(toggleSaveArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.savedArticles = action.payload;
      })
      .addCase(toggleSaveArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default favoriteSlice.reducer;
