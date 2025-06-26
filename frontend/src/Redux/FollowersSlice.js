import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper: cari istifadəçi ID-ni localStorage-dan götür
const getCurrentUserId = () => {
  // Məsələn, userId-ni token-dən və ya localStorage-dan alırsan
  // Burada sadəcə nümunə üçün localStorage-dan oxuyuram
  return localStorage.getItem("userId");
};

// 1. Follow user thunk
export const followUser = createAsyncThunk(
  "follow/followUser",
  async (targetUserId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5050/api/users/follow/${targetUserId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Follow əməliyyatından sonra məlumat yenilə
      const currentUserId = getCurrentUserId();
      if (currentUserId) {
        dispatch(fetchFollowData(currentUserId));
      }
      return targetUserId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Xəta baş verdi");
    }
  }
);

// 2. Unfollow user thunk
export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async (targetUserId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5050/api/users/unfollow/${targetUserId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Unfollow əməliyyatından sonra məlumat yenilə
      const currentUserId = getCurrentUserId();
      if (currentUserId) {
        dispatch(fetchFollowData(currentUserId));
      }
      return targetUserId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Xəta baş verdi");
    }
  }
);

// 3. Fetch follow data thunk
export const fetchFollowData = createAsyncThunk(
  "follow/fetchFollowData",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5050/api/users/${userId}/follow-data`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data; // { followers: [...], following: [...] }
    } catch (error) {
      return rejectWithValue("Follow məlumatları yüklənə bilmədi.");
    }
  }
);

const followSlice = createSlice({
  name: "follow",
  initialState: {
    followers: [],
    following: [],
    loading: false,
    error: "",
  },
  reducers: {},
  // ...
extraReducers: (builder) => {
  builder
    // fetchFollowData
    .addCase(fetchFollowData.pending, (state) => {
      state.loading = true;
      state.error = "";
    })
    .addCase(fetchFollowData.fulfilled, (state, action) => {
      state.loading = false;
      state.followers = action.payload.followers;
      state.following = action.payload.following;
    })
    .addCase(fetchFollowData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // followUser
    .addCase(followUser.pending, (state) => {
      state.loading = true;
      state.error = "";
    })
    .addCase(followUser.fulfilled, (state, action) => {
      state.loading = false;
      // Yeni izlənilən istifadəçini following-ə əlavə edirik
      const newUserId = action.payload; // targetUserId
      if (!state.following.some(user => user._id === newUserId)) {
        // Backend-dən istifadəçi məlumatı yoxdursa, sadəcə id əlavə etmək olar,
        // amma UI üçün daha yaxşıdır, burada əlavə user məlumatı olmalıdır.
        state.following.push({ _id: newUserId, username: "Yeni İstifadəçi" }); // ya da daha dolğun user obyekt əlavə et
      }
    })
    .addCase(followUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // unfollowUser
    .addCase(unfollowUser.pending, (state) => {
      state.loading = true;
      state.error = "";
    })
    .addCase(unfollowUser.fulfilled, (state, action) => {
      state.loading = false;
      const removedUserId = action.payload;
      // following massivindən çıxarırıq
      state.following = state.following.filter(user => user._id !== removedUserId);
      // lazım olsa followers massivindən də silə bilərsən
      state.followers = state.followers.filter(user => user._id !== removedUserId);
    })
    .addCase(unfollowUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
},

});

export default followSlice.reducer;
