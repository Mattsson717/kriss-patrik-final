import { createSlice } from "@reduxjs/toolkit";
// import { useSelector } from "react-redux";
import { API_URL } from "../utils/constants";

export const task = createSlice({
  name: "task",
  initialState: {
    items: [],
    error: null,
    // createdAt: new Date(),
  },
  reducers: {
    setItems: (store, action) => {
      store.items = action.payload;
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
    toggleTask: (store, action) => {
      const task = store.items.find((item) => item._id === action.payload);
      task.taken = !task.taken;
    },
    setNewTask: (store, action) => {
      store.items = [action.payload, ...store.items];
    },
  },
});

export const onToggleTask = (id, taken) => {
  return (dispatch) => {
    const options = {
      method: "PATCH",
      body: JSON.stringify({ taken: !taken ? true : false }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(API_URL(`tasks//taken`, id), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          dispatch(task.actions.toggleTask(id));
          dispatch(task.actions.setError(null));
        } else {
          dispatch(task.actions.setError(data.response));
        }
      });
  };
};

// export const onAddTask = (taskInput) => {
//   return (dispatch) => {
//     // dispatch(ui.actions.setLoading(true));
//     const options = {
//       method: "POST",
//       body: JSON.stringify({
//         title: taskInput,
//         description: taskInput,
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };
//     fetch(API_URL("task"), options)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           dispatch(task.actions.setError(null));
//         } else {
//           dispatch(task.actions.setError(data.response));
//         }
//       });
// .finally(() => dispatch(showTasksStopLoading(400)));
// setTaskInput("");
//   };
// };
