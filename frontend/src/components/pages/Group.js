import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  useColorModeValue,
  Stack,
  Checkbox,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

import Edit from "../modals/Edit";
import AddTask from "../modals/AddTask";
import AddMember from "../modals/AddMember";
import AcceptTask from "../modals/AcceptTask";
import { group } from "../../reducers/group";
import { task } from "../../reducers/task";
// import { onToggleTask } from "../../reducers/task";

const Group = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // const errorMess = useSelector((store) => store.group.error);

  const groupItems = useSelector((store) => store.group.items);
  // const groupTitle = useSelector((store) => store.group.userId);
  // const taskItems = useSelector((store) => store.group.task);
  const userId = useSelector((store) => store.user.userId);
  const groupId = useSelector((store) => store.group.groupId);
  const accessToken = useSelector((store) => store.user.accessToken);

  // MODALS

  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenMember,
    onOpen: onOpenMember,
    onClose: onCloseMember,
  } = useDisclosure();

  const {
    isOpen: isOpenAccept,
    onOpen: onOpenAccept,
    onClose: onCloseAccept,
  } = useDisclosure();

  const onButtonClick = (taskId) => {
    dispatch(task.actions.setTaskId(taskId));
    onOpenEdit();
  };

  //fetch tasks by groupId
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    };
    console.log("GROUP ID", groupId);
    fetch(API_URL(`tasks/group/${groupId}`), options) //get groupId that was posted with button in Mygroups
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          dispatch(group.actions.setItems(data.response));
          dispatch(group.actions.setError(null));
        } else {
          dispatch(group.actions.setError(data.response));
        }
      });
  }, [dispatch, accessToken, groupId]);

  const onToggleTask = (taskId) => {
    const options = {
      method: "PATCH",
      body: JSON.stringify({
        user: userId,
        _id: taskId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(API_URL(`user/${userId}/tasks/${taskId}`), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          dispatch(task.actions.setItems(taskId));
          dispatch(task.actions.setTaskId(data.response));
          dispatch(group.actions.setError(null));
        } else {
          dispatch(group.actions.setError(data.response));
        }
      });
  };

  // const onToggleTask = (taskId, taken) => {
  //   const options = {
  //     method: "PATCH",
  //     body: JSON.stringify({
  //       taken: !taken,
  //       _id: taskId,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };
  //   fetch(API_URL(`tasks/${taskId}/taken`), options)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.success) {
  //         dispatch(group.actions.toggleTask(taskId));
  //         dispatch(group.actions.setError(null));
  //       } else {
  //         dispatch(group.actions.setError(data.response));
  //       }
  //     });
  // };

  // const checkChange = () => {
  //   onOpenAccept()
  //   <AcceptTask isOpen={isOpenAccept} onClose={onCloseAccept} />;
  // };

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
        <Box>{console.log(groupItems)}</Box>
        {groupItems.map((item) => (
          <Box key={item._id}>
            <p>Title: {item.title}</p>
            <p>Description: {item.description}</p>
            <Stack spacing={5} direction="row">
              <Button onClick={() => onToggleTask(item._id)}>TAKE TASK</Button>

              {/* <Checkbox
                colorScheme="teal"
                name={item._id}
                id={item._id}
                variant="filled"
                mb={3}
                type="checkbox"
                value={item.taken}
                checked={item.taken}
                onChange={() => onToggleTask(item._id, item.taken)}
                onChange={() => checkChange()}
              /> */}
            </Stack>
            <Button
              variant="link"
              size="sm"
              color="teal"
              rightIcon={<EditIcon />}
              onClick={() => onButtonClick(item._id)}
            >
              Edit
            </Button>
            <Edit isOpen={isOpenEdit} onClose={onCloseEdit} />
            <p> Add Members. </p>
            {/* <p>{item.createdAt}</p> */}
          </Box>
        ))}
        <Button variant="link" size="sm" color="teal" onClick={onOpenAdd}>
          ADD TASK
        </Button>
        <AddTask isOpen={isOpenAdd} onClose={onCloseAdd} />
        <Button variant="link" size="sm" color="teal" onClick={onOpenMember}>
          ADD Member
        </Button>
        <AddMember isOpen={isOpenMember} onClose={onCloseMember} />
      </Box>
    </Flex>
  );
};

export default Group;
