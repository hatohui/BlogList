import { createSlice, current } from "@reduxjs/toolkit";
import blogsService from "../services/blogs";
import { setNotification } from "./notificationReducer";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlog(state, action) {
      return action.payload;
    },
    append(state, action) {
      return state.concat(action.payload);
    },
    remove(state, action) {
      const id = action.payload.id;
      return state.filter((blog) => blog.id !== id);
    },
    like(state, action) {
      const id = action.payload.id;
      return state.map((blog) => (id !== blog.id ? blog : action.payload));
    },
  },
});

export const { append, setBlog, remove, like } = blogSlice.actions;
export default blogSlice.reducer;

//init the blogs
export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogsService.getAll();
    dispatch(setBlog(blogs));
  };
};

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    try {
      const result = await blogsService.create(newBlog);
      dispatch(setNotification(`new Blog ${result.title} has been created!`));
      dispatch(append(result));
    } catch (exception) {
      console.log(exception);

      const message = exception.response.data.error;
      dispatch(setNotification(message));
    }
  };
};

export const addLike = (blog) => {
  return async (dispatch) => {
    try {
      const returned = await blogsService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1,
      });
      dispatch(like(returned));
    } catch (exception) {
      const message = exception.response.data.error;
      dispatch(setNotification(message));
    }
  };
};

export const removeBlog = (blog) => {
  return async (dispatch) => {
    try {
      const returned = await blogsService.remove(blog.id);
      dispatch(remove(returned));
    } catch (exception) {
      const message = exception.response.data.error;
      dispatch(setNotification(message));
    }
  };
};
