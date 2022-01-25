import React, { useEffect } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { useNavigate } from "react-router-dom";

import user from "../reducers/user";

const Home = () => {
  const accessToken = useSelector((store) => store.user.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  const onButtonClick = () => {
    batch(() => {
      dispatch(user.actions.setUserId(null));
      dispatch(user.actions.setUsername(null));
      dispatch(user.actions.setEmail(null));
      dispatch(user.actions.setAccessToken(null));
    });
    localStorage.removeItem("user");
  };

  return (
    <section>
      <button type="button" onClick={() => onButtonClick()}>
        Log out
      </button>

      <button type="button" onClick={() => navigate("/tasks")}>
        My tasks
      </button>

      <button type="button" onClick={() => navigate("/groups")}>
        My groups
      </button>

      <button type="button" onClick={() => navigate("/group")}>
        Create new group
      </button>
    </section>
  );
};

export default Home;
