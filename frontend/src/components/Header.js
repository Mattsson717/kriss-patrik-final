import React from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { useNavigate } from "react-router-dom";

import user from "../reducers/user";

import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  IconButton,
} from "@chakra-ui/react";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { AiFillHome } from "react-icons/ai";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const loggedInUser = useSelector((store) => store.user.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onButtonClick = () => {
    batch(() => {
      dispatch(user.actions.setUserId(null));
      dispatch(user.actions.setUsername(null));
      dispatch(user.actions.setEmail(null));
      dispatch(user.actions.setAccessToken(null));
    });
    localStorage.removeItem("user");
    navigate("/home");
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"end"}>
          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <IconButton
                colorScheme="teal"
                aria-label="Call Sage"
                fontSize="20px"
                icon={<AiFillHome />}
                onClick={() => navigate("/home")}
              />
              <Button rounded={"full"} onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Box>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      name={loggedInUser}
                      src={"https://bit.ly/broken-link"}
                    />
                  </MenuButton>
                  <MenuList alignItems={"center"}>
                    <br />
                    <Center>
                      <Avatar
                        size={"2xl"}
                        name={loggedInUser}
                        src={"https://bit.ly/broken-link"}
                      />
                    </Center>
                    <br />
                    <Center>
                      <p>{loggedInUser}</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    <MenuItem>Account Settings</MenuItem>
                    <MenuItem onClick={() => onButtonClick()}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Header;
