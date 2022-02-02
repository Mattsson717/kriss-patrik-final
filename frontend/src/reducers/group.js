import { createSlice } from "@reduxjs/toolkit";
// import { API_URL } from "../utils/constants";

export const group = createSlice({
  name: "group",
  initialState: {
    items: [],
    task: [],
    groupId: null,
    error: null,
  },
  reducers: {
    setItems: (store, action) => {
      store.items = action.payload;
    },
    setGroupId: (store, action) => {
      store.groupId = action.payload;
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
    setTask: (store, action) => {
      store.task = action.payload;
    },
    setError: (store, action) => {
      store.error = action.payload;
    },
  },
});
