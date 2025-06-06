// client/src/redux/slices/postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// GET ALL POSTS
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/posts");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// LIKE POST
export const likePost = createAsyncThunk(
  "posts/likePost",
  async ({ postId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// SHARE POST
export const sharePost = createAsyncThunk(
  "posts/sharePost",
  async ({ postId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/posts/${postId}/share`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// COMMENT POST
export const commentPost = createAsyncThunk(
  "posts/commentPost",
  async ({ postId, text }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/posts/${postId}/comment`,
        { text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchPosts
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // likePost
    builder.addCase(likePost.fulfilled, (state, action) => {
      const idx = state.posts.findIndex((p) => p._id === action.payload._id);
      if (idx !== -1) state.posts[idx] = action.payload;
    });

    // sharePost
    builder.addCase(sharePost.fulfilled, (state, action) => {
      const idx = state.posts.findIndex((p) => p._id === action.payload._id);
      if (idx !== -1) state.posts[idx] = action.payload;
    });

    // commentPost
    builder.addCase(commentPost.fulfilled, (state, action) => {
      const idx = state.posts.findIndex((p) => p._id === action.payload._id);
      if (idx !== -1) state.posts[idx] = action.payload;
    });
  },
});

export default postSlice.reducer;
