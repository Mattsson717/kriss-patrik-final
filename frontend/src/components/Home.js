import React, { useEffect } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Flex, Button } from "@chakra-ui/react";

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
    <Flex m={3}>
      <Button m={3} type="button" onClick={() => onButtonClick()}>
        Log out
      </Button>

      <Button m={3} type="button" onClick={() => navigate("/tasks")}>
        My tasks
      </Button>

      <Button m={3} type="button" onClick={() => navigate("/groups")}>
        My groups
      </Button>

      <Button m={3} type="button" onClick={() => navigate("/createGroup")}>
        Create new group
      </Button>
    </Flex>
  );
};

export default Home;
