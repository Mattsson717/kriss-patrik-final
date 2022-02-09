import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import CreateGroup from "./pages/CreateGroup";

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

const Home = () => {
  const accessToken = useSelector((store) => store.user.accessToken);
  const loggedInUser = useSelector((store) => store.user.username);

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

  return (
    <>
      <Header />
      <Flex
        as="section"
        d="flex"
        justifyContent="center"
        alignItems="start"
        h="100vh"
        m={5}
        maxW="1000px"
        w={["90vw", "90vw", "70vw", "70vw"]}
      >
        <Flex justify="center" align="center" mx="2">
          <Box
            w={["90%", "90%", "70%", "70%"]}
            justifyContent="center"
            alignItems="center"
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
            <ButtonGroup
              spacing="4"
              flexDirection={["column", "column", "row", "row"]}
              alignSelf={"center"}
            >
              <Button
                m={3}
                colorScheme="teal"
                onClick={() => navigate("/tasks")}
              >
                My tasks
              </Button>
              <Button
                m={3}
                colorScheme="teal"
                onClick={() => navigate("/groups")}
              >
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
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
