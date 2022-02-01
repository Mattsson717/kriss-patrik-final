import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  useColorMode,
  useColorModeValue,
  IconButton,
  Stack,
  Box,
  // FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useSelector, useDispatch, batch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../utils/constants";
import user from "../reducers/user";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("signin");
  const [error, setError] = useState(false);

  const errorMess = useSelector((store) => store.user.error);

  const accessToken = useSelector((store) => store.user.accessToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/home");
    }
  }, [accessToken, navigate]);

  const onFormSubmit = (event) => {
    event.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    };

    fetch(API_URL(mode), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          batch(() => {
            dispatch(user.actions.setUserId(data.response.userId));
            dispatch(user.actions.setUsername(data.response.username));
            dispatch(user.actions.setAccessToken(data.response.accessToken));
            dispatch(user.actions.setEmail(data.response.email));
            dispatch(user.actions.setError(null));
            //specify the data that we want to save in localStorage 'user' here
            localStorage.setItem(
              "user",
              JSON.stringify({
                userId: data.response.userId,
                username: data.response.username,
                email: data.response.email,
                accessToken: data.response.accessToken,
              })
            );
          });
        } else {
          batch(() => {
            dispatch(user.actions.setUserId(null));
            dispatch(user.actions.setUsername(null));
            dispatch(user.actions.setAccessToken(null));
            dispatch(user.actions.setEmail(null));
            dispatch(user.actions.setError(data.response));
          });
          setError(true);
        }
      });
  };

  return (
    <Flex
      height="vh100"
      alignItems="center"
      justifyContent="center"
      // bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4x1"}>GIVERS GAME</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <form onSubmit={onFormSubmit}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                placeholder="username"
                variant="filled"
                mb={3}
                type="text"
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />

              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                placeholder="*******"
                variant="filled"
                mb={6}
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              {mode === "signup" && (
                <>
                  <FormLabel htmlFor="email">Email</FormLabel>

                  <Input
                    placeholder="yourMail@mail.com"
                    variant="filled"
                    mb={3}
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </>
              )}
              <Flex alignItems="center" justifyContent="center">
                <Button colorScheme="teal" m={2} type="submit">
                  Submit
                </Button>

                {mode === "signin" && (
                  <Button
                    colorScheme="teal"
                    type="button"
                    m={2}
                    onClick={() => setMode("signup")}
                  >
                    Sign up
                  </Button>
                )}
                {mode === "signup" && (
                  <Button
                    colorScheme="teal"
                    type="button"
                    m={2}
                    onClick={() => setMode("signin")}
                  >
                    Login
                  </Button>
                )}
              </Flex>
            </form>
            {error && <p>{errorMess}</p>}
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
