import { createSlice } from "@reduxjs/toolkit";

export const task = createSlice({
  name: "task",
  initialState: {
    items: [],
    error: null,
    isTaken: false,
    // createdAt: new Date(),
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
  // check task as taken
  toggleTask: (store, action) => {
    const updatedItems = store.items.map((item) => {
      if (item._id === action.payload) {
        const updatedTask = {
          ...item,
          isTaken: !item.isTaken,
        };
        return updatedTask;
      } else {
        return item;
      }
    });
    store.items = updatedItems;
  },
});
