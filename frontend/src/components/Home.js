import React, { useEffect } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Flex,
  Button,
  Box,
  useColorModeValue,
  Heading,
  Text,
  ButtonGroup,
  useDisclosure,
} from "@chakra-ui/react";

import user from "../reducers/user";
import CreateGroup from "./pages/CreateGroup";

const Home = () => {
  const accessToken = useSelector((store) => store.user.accessToken);
  const loggedInUser = useSelector((store) => store.user.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // MODAL

  const {
    isOpen: isOpenCreateGroup,
    onOpen: onOpenCreateGroup,
    onClose: onCloseCreateGroup,
  } = useDisclosure();

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
    <Flex
      m={3}
      justifyContent={"space-evenly"}
      alignItems={"center"}
      h={"100vh"}
    >
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
      >
        <h2>Hello {loggedInUser}!</h2>
        <Box>
          <Heading as="h1" fontSize="3xl" fontWeight="semi" color="teal">
            GIVERS GAME
          </Heading>
          <Text mt="1" fontSize="md">
            Some text about TASKS
          </Text>
        </Box>
        <ButtonGroup spacing="4">
          <Button m={3} colorScheme="teal" onClick={() => navigate("/tasks")}>
            My tasks
          </Button>
          <Button m={3} colorScheme="teal" onClick={() => navigate("/groups")}>
            My groups
          </Button>
          <Button m={3} colorScheme="teal" onClick={onOpenCreateGroup}>
            Create Group
          </Button>
          <CreateGroup
            isOpen={isOpenCreateGroup}
            onClose={onCloseCreateGroup}
          />
        </ButtonGroup>
        <ButtonGroup spacing="4">
          <Button m={3} colorScheme="teal" onClick={() => onButtonClick()}>
            Log out
          </Button>
        </ButtonGroup>
      </Box>
    </Flex>
  );
};

export default Home;
