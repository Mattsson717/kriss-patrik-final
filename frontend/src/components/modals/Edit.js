import React, { useState } from "react";
import { useSelector, useDispatch, batch } from "react-redux";

import { API_URL } from "../../utils/constants";
import { group } from "../../reducers/group";

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
  Textarea,
} from "@chakra-ui/react";

const Edit = ({ isOpen, onClose }) => {
  const taskId = useSelector((store) => store.group.taskId);
  const title = useSelector((store) => store.group.title);
  const description = useSelector((store) => store.group.description);

  const [taskInfo, setTaskInfo] = useState({
    title: title,
    description: description,
  });
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const toast = useToast();

  const onFormSubmit = (event) => {
    event.preventDefault();

    // EDIT a specific TASK
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: taskInfo.title,
        description: taskInfo.description,
      }),
    };
    fetch(API_URL(`tasks/${taskId}`), options)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          dispatch(group.actions.editTask(data));
          // dispatch(group.actions.setTitle(data.response));
          // dispatch(group.actions.setDescription(data.response));
          dispatch(group.actions.setError(null));
          toast({
            title: "Task succesfully edited.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          // });
        } else {
          batch(() => {
            dispatch(group.actions.setError(data.response));
            toast({
              title: "Something went wrong",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
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
                  defaultValue={taskInfo.title}
                  onChange={(event) =>
                    setTaskInfo({ ...taskInfo, title: event.target.value })
                  }
                />
                <FormLabel htmlFor="description" />
                <Textarea
                  variant="filled"
                  mb={3}
                  type="text"
                  id="description"
                  placeholder="description"
                  defaultValue={taskInfo.description}
                  onChange={(event) =>
                    setTaskInfo({
                      ...taskInfo,
                      description: event.target.value,
                    })
                  }
                />
                {/* DELETE TASK BUTTON */}

                <Box m={4}>
                  <Button type="submit" onClick={!error ? "" : onClose}>
                    Edit
                  </Button>
                  <Button onClick={onClose}>Close</Button>
                </Box>
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Edit;
