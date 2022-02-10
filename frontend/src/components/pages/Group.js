import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";

import {
  Flex,
  Box,
  Text,
  useDisclosure,
  Button,
  useToast,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

import Edit from "../modals/Edit";
import AddTask from "../modals/AddTask";
import AddMember from "../modals/AddMember";
import Header from "../Header";
import { group } from "../../reducers/group";
import { task } from "../../reducers/task";

const Group = () => {
  const dispatch = useDispatch();

  const groupItems = useSelector((store) => store.group.items);

  const userId = useSelector((store) => store.user.userId);
  const groupId = useSelector((store) => store.group.groupId);
  const accessToken = useSelector((store) => store.user.accessToken);

  const toast = useToast();

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

  const onButtonClick = (taskId) => {
    dispatch(group.actions.setTaskId(taskId));
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
    fetch(API_URL(`tasks/group/${groupId}`), options)
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA:", data);
        if (data.success) {
          dispatch(group.actions.setItems(data.response));
          dispatch(group.actions.setError(null));
        } else {
          dispatch(group.actions.setError(data.response));
        }
      });
  }, [dispatch, accessToken, groupId]);

  const onTakenTask = (taskId) => {
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
          dispatch(task.actions.setItems(data.response));
          dispatch(task.actions.setTaskId(data.response));
          dispatch(task.actions.setError(null));
          toast({
            title: "You have accepted the task.",
            description: "You can find it in My Tasks",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          dispatch(task.actions.setError(data.response));
          toast({
            title: "Something went wrong.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      });
  };

  return (
    <>
      <Header />
      <Flex
        maxW="1000px"
        w={["90vw", "90vw", "70vw", "70vw"]}
        direction={["column", "column", "row", "row"]}
        justify="center"
        p={4}
        alignItems="start"
      >
        <Button variant="link" size="sm" color="teal" onClick={onOpenAdd}>
          ADD TASK
        </Button>
        <AddTask isOpen={isOpenAdd} onClose={onCloseAdd} />
        <Button variant="link" size="sm" color="teal" onClick={onOpenMember}>
          ADD Member
        </Button>
        <AddMember isOpen={isOpenMember} onClose={onCloseMember} />

        {groupItems.map((item) => (
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
              <Box
                direction={"column"}
                wordBreak={"break-word"}
                w={["60vw", "60vw", "50vw", "50vw"]}
              >
                <Text mb="2" p={5} fontWeight="bold">
                  Title: {item.title}
                </Text>
                <Text>Description: {item.description}</Text>

                <Button
                  disabled={!item.user >= 1 ? false : true}
                  onClick={() => onTakenTask(item._id)}
                >
                  TAKE TASK
                </Button>
              </Box>
            </Box>
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default Group;
