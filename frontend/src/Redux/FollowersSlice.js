import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ 1. İstifadəçini takip et
export const followUser = createAsyncThunk(
  "follow/followUser",
  async (targetUserId, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5050/api/users/follow/${targetUserId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("İstifadəçi izlənilir ✅");

      // Aktiv istifadəçinin follow məlumatlarını yenilə
      const currentUserId = getState().users.currentUser?._id;
      if (currentUserId) {
        dispatch(fetchFollowData(currentUserId));
      }

      return targetUserId;
    } catch (error) {
      toast.error("Follow zamanı xəta baş verdi");
      return rejectWithValue(
        error.response?.data?.message || "Xəta baş verdi"
      );
    }
  }
);

// ✅ 2. İstifadəçini unfollow et
export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async (targetUserId, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5050/api/users/unfollow/${targetUserId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("İzləmə dayandırıldı ❌");

      // Aktiv istifadəçinin follow məlumatlarını yenilə
      const currentUserId = getState().users.currentUser?._id;
      if (currentUserId) {
        dispatch(fetchFollowData(currentUserId));
      }

      return targetUserId;
    } catch (error) {
      toast.error("Unfollow zamanı xəta baş verdi");
      return rejectWithValue(
        error.response?.data?.message || "Xəta baş verdi"
      );
    }
  }
);

// ✅ 3. Follow məlumatlarını gətir
export const fetchFollowData = createAsyncThunk(
  "follow/fetchFollowData",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5050/api/users/${userId}/follow-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue("Follow məlumatları yüklənə bilmədi.");
    }
  }
);

// 🔧 Slice
const followSlice = createSlice({
  name: "follow",
  initialState: {
    followers: [],   // səni izləyənlər
    following: [],   // sənin izlədiklərin
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch follow data
      .addCase(fetchFollowData.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchFollowData.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload.followers || [];
        state.following = action.payload.following || [];
      })
      .addCase(fetchFollowData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Follow etdikdən sonra follow siyahısına əlavə et
      .addCase(followUser.fulfilled, (state, action) => {
        const id = action.payload;
        if (!state.following.includes(id)) {
          state.following.push(id);
        }
      })

      // ✅ Unfollow etdikdən sonra listdən sil
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const id = action.payload;
        state.following = state.following.filter((f) => f !== id);
        state.followers = state.followers.filter((f) => f !== id); // ehtiyac varsa
      });
  },
});

export default followSlice.reducer;
