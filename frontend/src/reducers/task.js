import { createSlice } from "@reduxjs/toolkit";

export const task = createSlice({
  name: "task",
  initialState: {
    items: [],
    error: null,
  },
  reducers: {
    setItems: (store, action) => {
      store.items = action.payload;
    },
    setNewTask: (store, action) => {
      store.items = [action.payload, ...store.items];
    },
    setError: (store, action) => {
      store.error = action.payload;
    },
  },
});
