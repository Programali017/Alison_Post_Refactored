import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../axiosConfig"; // instancia Axios con token automático

// GET ALL POSTS
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/posts");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// CREATE POST
export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ title, content }, thunkAPI) => {
    try {
      const res = await api.post("/posts", { title, content });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// EDIT POST
export const editPost = createAsyncThunk(
  "posts/editPost",
  async ({ postId, title, content }, thunkAPI) => {
    try {
      const res = await api.put(`/posts/${postId}`, { title, content });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// DELETE POST
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ postId }, thunkAPI) => {
    try {
      await api.delete(`/posts/${postId}`);
      return postId;
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
      const res = await api.post(`/posts/${postId}/like`);
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
      const res = await api.post(`/posts/${postId}/share`);
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
      const res = await api.post(`/posts/${postId}/comment`, { text });
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
    builder
      // fetchPosts
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
      })

      // createPost
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })

      // editPost
      .addCase(editPost.fulfilled, (state, action) => {
        const idx = state.posts.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.posts[idx] = action.payload;
      })

      // deletePost
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      })

      // likePost
      .addCase(likePost.fulfilled, (state, action) => {
        const idx = state.posts.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.posts[idx] = action.payload;
      })

      // commentPost
      .addCase(commentPost.fulfilled, (state, action) => {
        const idx = state.posts.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.posts[idx] = action.payload;
      });
  },
});

export default postSlice.reducer;
