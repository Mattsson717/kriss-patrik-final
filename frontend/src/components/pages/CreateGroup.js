import React, { useState } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
// import { useNavigate } from "react-router-dom";

import { API_URL } from "../../utils/constants";
import { group } from "../../reducers/group";
// import user from "../../reducers/user";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  Button,
  Input,
  FormLabel,
  Box,
  useToast,
} from "@chakra-ui/react";

const CreateGroup = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  // const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);

  // const groupItems = useSelector((store) => store.group.items);
  // const accessToken = useSelector((store) => store.user.accessToken);
  const dispatch = useDispatch();
  const toast = useToast();
  // const navigate = useNavigate();
  const errorMess = useSelector((store) => store.user.error);
  const userId = useSelector((store) => store.user.userId);

  const onFormSubmit = (event) => {
    event.preventDefault();

    // userId in JSON.stringify
    // dispatch(group.actions.setUserId(data.response)) in batch();
    const optionsPost = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    };
    fetch(API_URL(`group/user/${userId}`), optionsPost)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          batch(() => {
            dispatch(group.actions.setNewGroup(data.response));
            toast({
              title: "Group succesfully created.",
              description: "Go to My groups to add members and tasks.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            dispatch(group.actions.setError(null));
          });
        } else {
          batch(() => {
            dispatch(group.actions.setError(data.response));
          });
          setError(true);
        }
      });

    // Patch the user to the group
    // const optionsPatch = {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },

    // };
    // fetch(API_URL(`user/${userId}/groups/${groupId}`), optionsPatch)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data.success) {
    //       batch(() => {
    //         dispatch(task.actions.setNewTask(data.response));
    //         dispatch(group.actions.setError(null));
    //       });
    //     } else {
    //       batch(() => {
    //         dispatch(group.actions.setError(data.response));
    //       });
    //       setError(true);
    //     }
    //   });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <form onSubmit={onFormSubmit}>
                <FormLabel htmlFor="title" />
                <Input
                  variant="filled"
                  mb={3}
                  type="text"
                  id="title"
                  placeholder="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
                <FormLabel htmlFor="description" />
                <Input
                  variant="filled"
                  mb={3}
                  type="text"
                  id="description"
                  placeholder="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                {/* <FormLabel htmlFor="tasks" />
                <Input
                  variant="filled"
                  mb={3}
                  type="text"
                  id="tasks"
                  placeholder="Add task (you can add tasks later)"
                  value={task}
                  onChange={(event) => setTask(event.target.value)}
                />
                <button>+</button> */}

                <Box m={4}>
                  {/* Disable button if input fields are empty */}
                  <Button type="submit" onClick={onClose}>
                    Create new group
                  </Button>
                  <Button onClick={onClose}>Close</Button>
                </Box>
              </form>

              {error && <p>{errorMess}</p>}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroup;
