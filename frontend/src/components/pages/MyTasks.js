import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";
import { task, onToggleTask } from "../../reducers/task";
import {
  Flex,
  Box,
  useColorModeValue,
  Text,
  Stack,
  Checkbox,
} from "@chakra-ui/react";

const MyTasks = () => {
  const dispatch = useDispatch();
  const taskItems = useSelector((store) => store.task.items);
  const userId = useSelector((store) => store.user.userId);
  const accessToken = useSelector((store) => store.user.accessToken);
  const loggedInUser = useSelector((store) => store.user.username);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    };
    fetch(API_URL(`tasks/${userId}`), options)
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
  }, [dispatch, accessToken, userId]);

  return (
    <Flex
      as="section"
      d="flex"
      justifyContent="center"
      alignItems="start"
      h="100vh"
      m={5}
    >
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
        w={350}
      >
        <Text>{loggedInUser}s Tasks:</Text>
        {taskItems.map((item) => (
          <Flex key={item._id}>
            <Box m={2} w={"80%"} p={2} rounded={"lg"} bg={"teal"}>
              <span>{item.description}</span>
              <Stack spacing={5} direction="row">
                <Checkbox
                  colorScheme="teal"
                  name={item._id}
                  variant="filled"
                  mb={3}
                  type="checkbox"
                  value={item._id}
                  onChange={() => dispatch(onToggleTask(item._id, item.taken))}
                />
              </Stack>
              {/* <input
                name={item._id}
                variant="filled"
                mb={3}
                type="checkbox"
                value={item._id}
                onChange={() => dispatch(onToggleTask(item._id, item.taken))}
              /> */}

              {/* <li> {item.group} </li> */}

              {item.taken}
            </Box>
          </Flex>
        ))}
      </Box>
    </Flex>
  );
};

export default MyTasks;
