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

// ArticleSlice.js
export const likeArticle = createAsyncThunk(
  "articles/likeArticle",
  async (articleId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      // Burada endpointi backenddə işləyən route-a uyğun edin
      const res = await axios.patch(
        `http://localhost:5050/api/users/articles/${articleId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { articleId, likes: res.data.likes };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
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

// Yorum əlavə et
export const addCommentToArticle = createAsyncThunk(
  "articles/addCommentToArticle",
  async ({ articleId, text }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5050/api/users/articles/${articleId}/comment`,
        { text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { articleId, comments: res.data.comments };
    } catch (err) {
      return rejectWithValue("Şərh əlavə olunarkən xəta baş verdi.");
    }
  }
);

export const fetchAllArticles = createAsyncThunk(
  "articles/fetchAllArticles",
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
    })
    .addCase(addCommentToArticle.fulfilled, (state, action) => {
      const { articleId, comments } = action.payload;
      state.myArticles = state.myArticles.map((article) =>
        article._id === articleId ? { ...article, comments } : article
      );
    })
    .addCase(addCommentToArticle.rejected, (state, action) => {
      state.error = action.payload;
    })
    .addCase(likeArticle.fulfilled, (state, action) => {
      const { articleId, likes } = action.payload;
      state.myArticles = state.myArticles.map((article) =>
        article._id === articleId ? { ...article, likes } : article
      );
    })
    .addCase(fetchAllArticles.pending, (state) => {
  state.loading = true;
  state.error = "";
})
.addCase(fetchAllArticles.fulfilled, (state, action) => {
  state.loading = false;
  state.myArticles = action.payload;
})
.addCase(fetchAllArticles.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

    .addCase(likeArticle.rejected, (state, action) => {
      state.error = action.payload;
    });
}


});

export default articleSlice.reducer;
