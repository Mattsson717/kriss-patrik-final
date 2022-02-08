import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";
import { group } from "../../reducers/group";
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
  const taskItems = useSelector((store) => store.group.items);
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
          dispatch(group.actions.setItems(data.response));
          dispatch(group.actions.setError(null));
        } else {
          dispatch(group.actions.setItems([]));
          dispatch(group.actions.setError(data.response));
        }
      });
  }, [dispatch, accessToken, userId]);

  // const onToggleTask = (taskId, taken) => {
  //   return (dispatch) => {
  //     const options = {
  //       method: "PATCH",
  //       body: JSON.stringify({ taken: !taken ? true : false }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };
  //     fetch(API_URL(`tasks/${taskId}/taken`), options)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.success) {
  //           dispatch(task.actions.toggleTask(taskId));
  //           dispatch(task.actions.setError(null));
  //         } else {
  //           dispatch(task.actions.setError(data.response));
  //         }
  //       });
  //     console.log("Task ID", taskId);
  //   };
  // };

  return (
    <Flex
      maxW="1000px"
      w={["90vw", "90vw", "70vw", "70vw"]}
      direction={["column", "column", "row", "row"]}
      justify="center"
      p={4}
    >
      <Text as="h2" fontSize="xl" fontWeight="bold" mb="2">
        {loggedInUser}s Tasks:
      </Text>

      {taskItems.map((item) => (
        <Flex justify="center" align="center" mx="2" key={item._id}>
          <Box
            maxW="1000px"
            w={["90%", "90%", "70%", "70%"]}
            direction={["column", "column", "row", "row"]}
            justify="center"
            boxShadow="md"
            rounded="lg"
            p={4}
          >
            <Box direction={"column"}>
              <Text mb="2" p={5}>
                {item.title}
                {item.description}
              </Text>
            </Box>
          </Box>
        </Flex>
      ))}
    </Flex>
  );
};

export default MyTasks;
