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

const AcceptTask = ({ isOpen, onClose }) => {
  const errorMess = useSelector((store) => store.task.error);
  const taskId = useSelector((store) => store.task.taskId);
  const title = useSelector((store) => store.task.title);
  const description = useSelector((store) => store.task.description);
  // const groupItems = useSelector((store) => store.group.items);
  // const accessToken = useSelector((store) => store.user.accessToken);
  const [taskInfo, setTaskInfo] = useState({
    title: title,
    description: description,
  });
  // const [description, setDescription] = useState("description");
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const toast = useToast();

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
            dispatch(task.actions.setTitle(data.response));
            dispatch(task.actions.setDescription(data.response));
            toast({
              title: "Group succesfully edited.",
              description: "Some description.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            dispatch(task.actions.setError(null));
          });
        } else {
          batch(() => {
            dispatch(task.actions.setError(data.response));
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
          <ModalHeader>Accept task?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Button>Yes</Button>
              <Button>No</Button>

              {error && <p>{errorMess}</p>}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AcceptTask;
