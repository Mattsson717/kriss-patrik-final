import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";

const Start = () => {
  const navigate = useNavigate();

  return <Button onClick={() => navigate("/Login")}>Log in</Button>;
};

export default Start;
