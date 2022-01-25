import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../../utils/constants";
import { group } from "../../reducers/group";
import user from "../../reducers/user";

const CreateGroup = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // const groupItems = useSelector((store) => store.group.items);
  // const accessToken = useSelector((store) => store.user.accessToken);
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const onFormSubmit = (event) => {
    event.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    };
    fetch(API_URL("home/group"), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          batch(() => {
            dispatch(group.actions.setNewGroup(data.response));
            dispatch(group.actions.setError(null));
          });
        } else {
          batch(() => {
            dispatch(group.actions.setError(data.response));
          });
        }
      });
  };

  return (
    <form onSubmit={onFormSubmit}>
      <div>
        <label htmlFor="title" />
        <input
          type="text"
          id="title"
          placeholder="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <label htmlFor="description" />
        <input
          type="text"
          id="description"
          placeholder="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button type="submit">Create new group</button>
      </div>
    </form>
  );
};

export default CreateGroup;
