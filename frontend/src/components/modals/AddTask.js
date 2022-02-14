import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { API_URL } from "../../utils/constants";
import { group } from "../../reducers/group";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  Input,
  FormLabel,
  Box,
  useToast,
  Textarea,
  Button,
} from "@chakra-ui/react";

const AddTask = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);

  const groupId = useSelector((store) => store.group.groupId);
  const accessToken = useSelector((store) => store.user.accessToken);

  const dispatch = useDispatch();
  const toast = useToast();

  const onFormSubmit = (event) => {
    event.preventDefault();

    // CREATE TASK and put it into the GROUP
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
        if (data.success) {
          dispatch(group.actions.setError(null));
          toast({
            title: "Task succesfully created.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          dispatch(group.actions.setItems(data.response));
        } else {
          dispatch(group.actions.setError(data.response));
          toast({
            title: "Task title already exist",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      });
    setError(true);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <form onSubmit={(event) => onFormSubmit(event)}>
                <FormLabel htmlFor="addTask">Fill in task:</FormLabel>
                <Input
                  placeholder="title"
                  variant="filled"
                  mb={3}
                  type="text"
                  id="addTask"
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
                <Textarea
                  placeholder="description (optional)"
                  variant="filled"
                  mb={3}
                  type="text"
                  id="addTask"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />

                <Button type="submit" onClick={!error ? "" : onClose}>
                  Add task
                </Button>
                <Button onClick={onClose}>Close</Button>
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddTask;
