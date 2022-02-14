import { createSlice } from "@reduxjs/toolkit";

export const group = createSlice({
  name: "group",
  initialState: {
    items: [],
    taskId: null,
    title: [],
    groupId: null,
    error: null,
  },
  reducers: {
    setItems: (store, action) => {
      store.items = action.payload;
    },
    setTaskId: (store, action) => {
      store.taskId = action.payload;
    },
    setGroupId: (store, action) => {
      store.groupId = action.payload;
    },
    editTask: (store, action) => {
      const editTasks = store.items.map((item) => {
        if (item._id === action.payload._id) {
          item = action.payload;
          return item;
        } else {
          return item;
        }
      });
      store.items = editTasks;
    },
    setUserId: (store, action) => {
      store.items = action.payload;
    },
    setTitle: (store, action) => {
      store.items = action.payload;
    },
    setDescription: (store, action) => {
      store.items = action.payload;
    },
    setNewGroup: (store, action) => {
      store.items = [action.payload, ...store.items];
    },
    setNewTask: (store, action) => {
      store.task = [action.payload, ...store.task];
    },
    setError: (store, action) => {
      store.error = action.payload;
    },
  },
});
