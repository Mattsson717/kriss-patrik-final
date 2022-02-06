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

const AddTask = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);

  // const groupItems = useSelector((store) => store.group.items);
  // const accessToken = useSelector((store) => store.user.accessToken);
  const dispatch = useDispatch();
  const toast = useToast();

  const errorMess = useSelector((store) => store.user.error);
  const groupId = useSelector((store) => store.group.groupId);
  const accessToken = useSelector((store) => store.user.accessToken);

  const onFormSubmit = (event) => {
    event.preventDefault();

    // DELETES THE INPUT THAT'S NOT FILLED IN
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
          dispatch(group.actions.setError(null));
          // batch(() => {
          dispatch(group.actions.setGroupId(data.response));
          dispatch(group.actions.setNewTask(data.response));
          // });
        } else {
          dispatch(group.actions.setError(data.response));
        }
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ADD Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <form onSubmit={(event) => onFormSubmit(event)}>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddTask;
