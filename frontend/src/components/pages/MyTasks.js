import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";
import { task } from "../../reducers/task";

const MyTasks = () => {
  const dispatch = useDispatch();
  const taskItems = useSelector((store) => store.task.items);
  const accessToken = useSelector((store) => store.user.accessToken);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    };
    fetch(API_URL("home/tasks"), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          dispatch(task.actions.setItems(data.response));
          dispatch(task.actions.setError(null));
        } else {
          dispatch(task.actions.setItems([]));
          dispatch(task.actions.setError(data.response));
        }
      });
  }, [dispatch, accessToken]);

  return (
    <div>
      {taskItems.map((item) => (
        <div key={item._id}>
          <ul>
            <li> {item.title} </li>
            <li> {item.description} </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MyTasks;
