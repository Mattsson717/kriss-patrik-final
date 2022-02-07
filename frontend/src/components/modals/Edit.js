import React, { useState } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
// import { useNavigate } from "react-router-dom";

import { API_URL } from "../../utils/constants";
import { group } from "../../reducers/group";
import { task } from "../../reducers/task";
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

const Edit = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);

  // const groupItems = useSelector((store) => store.group.items);
  // const accessToken = useSelector((store) => store.user.accessToken);
  const dispatch = useDispatch();
  const toast = useToast();

  const errorMess = useSelector((store) => store.user.error);
  const taskId = useSelector((store) => store.task.taskId);

  const onFormSubmit = (event) => {
    event.preventDefault();

    // DELETES THE INPUT THAT'S NOT FILLED IN, NEED TO REFRESH TO SEE
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    };
    fetch(API_URL(`tasks/${taskId}`), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          batch(() => {
            dispatch(task.actions.setItem(data.response));
            toast({
              title: "Group succesfully edited.",
              description: "Some description.",
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
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit</ModalHeader>
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
                {/* DELETE */}

                <Box m={4}>
                  {/* Disable button if input fields are empty */}
                  <Button type="submit" onClick={onClose}>
                    Edit
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

export default Edit;
