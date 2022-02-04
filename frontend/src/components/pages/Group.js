import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { API_URL } from "../../utils/constants";
import {
  Flex,
  Box,
  useColorModeValue,
  Stack,
  Checkbox,
  FormLabel,
  Input,
} from "@chakra-ui/react";

import { group } from "../../reducers/group";
import { task } from "../../reducers/task";
import { onToggleTask } from "../../reducers/task";

const Group = () => {
  // const [taskInput, setTaskInput] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [error, setError] = useState(false);
  const dispatch = useDispatch();

  // const errorMess = useSelector((store) => store.group.error);

  const groupItems = useSelector((store) => store.group.items);
  // const taskItems = useSelector((store) => store.group.task);

  const groupId = useSelector((store) => store.group.groupId);
  const accessToken = useSelector((store) => store.user.accessToken);

  // const onFormSubmit = (event) => {
  //   event.preventDefault();
  //   if (event.key === "Enter") {
  //     dispatch(onAddTask(taskInput));
  //     // setTaskInput("");
  //   }
  // };

  //fetch tasks by groupId
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    };

    fetch(API_URL(`tasks/group/${groupId}`), options) //get groupId that was posted with button in Mygroups
      .then((res) => res.json())
      .then((data) => {
        console.log("Specific Group ID :", groupId);
        if (data.success) {
          dispatch(group.actions.setItems(data.response));
          dispatch(group.actions.setError(null));
        } else {
          dispatch(group.actions.setItems([]));
          dispatch(group.actions.setError(data.response));
        }
      });
  }, [dispatch, accessToken, groupId]);

  const onFormSubmit = (event) => {
    event.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify({ title, description, group: groupId }),
    };
    fetch(API_URL(`task/group/${groupId}`), options)
      .then((res) => res.json())
      .then((data) => {
        console.log("Specific Group ID :", groupId);
        if (data.success) {
          console.log("add todo", data);
          batch(() => {
            dispatch(group.actions.setGroupId(data.response));
            dispatch(group.actions.setNewTask(data.response));
          });
        }
      });
  };

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
        <Box>Group title</Box>
        {groupItems.map((item) => (
          <Box key={item._id}>
            <p>Title: {item.title}</p>
            <p>Description: {item.description}</p>
            <Stack spacing={5} direction="row">
              <Checkbox
                colorScheme="teal"
                name={item._id}
                variant="filled"
                mb={3}
                type="checkbox"
                value={item._id}
                checked={item.taken}
                onChange={() => dispatch(onToggleTask(item._id, item.taken))}
              />
            </Stack>
            <p>. Edit Task. Add Members</p>
            {/* <p>{item.createdAt}</p> */}
          </Box>
        ))}
        <form onSubmit={onFormSubmit}>
          <FormLabel htmlFor="addTask">Add Task</FormLabel>
          <Input
            placeholder="title"
            variant="filled"
            mb={3}
            type="text"
            id="addTask"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Input
            placeholder="description"
            variant="filled"
            mb={3}
            type="text"
            id="addTask"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <button type="submit">add task</button>
        </form>
      </Box>
    </Flex>
  );
};

export default Group;
