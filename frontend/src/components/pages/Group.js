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

  // Takes the task id to open the specific TASK to open EDIT modal
  const onButtonClick = (taskId) => {
    dispatch(group.actions.setTaskId(taskId));
    onOpenEdit();
  };

  //fetch TASKS by groupId
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    };
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

  // Accept the TASK and send it to the logged in users MY TASKs
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
        height="vh100"
        alignItems="center"
        justifyContent="center"
        direction={"column"}
      >
        <Box direction="row" justifyContent="center">
          <Button
            variant="link"
            m={3}
            size="sm"
            color="teal"
            onClick={onOpenAdd}
          >
            + ADD TASK
          </Button>
          <AddTask isOpen={isOpenAdd} onClose={onCloseAdd} />
          <Button
            variant="link"
            m={3}
            size="sm"
            color="teal"
            onClick={onOpenMember}
          >
            + ADD MEMBER
          </Button>
          <AddMember isOpen={isOpenMember} onClose={onCloseMember} />
        </Box>

        {groupItems.map((item) => (
          <Flex justify="center" align="center" mx="2" key={item._id}>
            <Box
              maxW="1000px"
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
                w={["260px", "350px", "400px", "450px"]}
              >
                <Text m="2" p={5} fontWeight="bold">
                  {item.title}
                </Text>
                <Text m="2" p={2}>
                  {item.description}
                </Text>

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
