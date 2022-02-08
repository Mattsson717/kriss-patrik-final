import { createSlice } from "@reduxjs/toolkit";

export const task = createSlice({
  name: "task",
  initialState: {
    items: [],
    title: null,
    description: null,
    error: null,
    // createdAt: new Date(),
  },
  reducers: {
    setItems: (store, action) => {
      store.items = action.payload;
    },
    setUser: (store, action) => {
      store.items = action.payload;
    },
    setTitle: (store, action) => {
      store.title = action.payload;
    },
    setDescription: (store, action) => {
      store.description = action.payload;
    },
    setTaskId: (store, action) => {
      store.taskId = action.payload;
    },
    deleteTask: (store, action) => {
      store.items = store.items.filter((item) => item._id !== action.payload);
    },
    setError: (store, action) => {
      store.error = action.payload;
    },

    setNewTask: (store, action) => {
      store.items = [action.payload, ...store.items];
    },
  },
});
