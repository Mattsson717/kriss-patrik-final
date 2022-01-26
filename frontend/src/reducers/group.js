import { createSlice } from "@reduxjs/toolkit";
// import { API_URL } from "../utils/constants";

export const group = createSlice({
  name: "group",
  initialState: {
    items: [],
    title: {},
    description: {},
    task: [],
    error: null,
  },
  reducers: {
    setItems: (store, action) => {
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
      store.items = action.payload;
    },
    setError: (store, action) => {
      store.error = action.payload;
    },
  },
});

// export const showGroup = () => {
//   return (dispatch) => {
//     const options = {
//       method: "GET",
//     };
//     fetch(API_URL, options)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           dispatch(group.actions.setError(null));
//         } else {
//           dispatch(group.actions.setError(data.response));
//         }
//       });
//   };
// };