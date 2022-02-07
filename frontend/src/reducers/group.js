import { createSlice } from "@reduxjs/toolkit";
// import { API_URL } from "../utils/constants";
// const groupStorage = localStorage.getItem("group")
//   ? {
//       groupId: JSON.parse(localStorage.getItem("group")).groupId,
//     }
//   : {
//       groupId: null,
//     };

export const group = createSlice({
  name: "group",
  initialState: {
    items: [],
    task: [],
    // userId: [],
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
    setNewTask: (store, action) => {
      store.task = [action.payload, ...store.task];
    },
    setTask: (store, action) => {
      store.task = action.payload;
    },
    setError: (store, action) => {
      store.error = action.payload;
    },
    toggleTask: (store, action) => {
      const toggledTask = store.items.find(
        (item) => item._id === action.payload
      );
      toggledTask.taken = !toggledTask.taken;
    },
  },
});
