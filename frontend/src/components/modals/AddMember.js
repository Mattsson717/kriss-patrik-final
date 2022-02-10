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
  Input,
  FormLabel,
  Box,
  useToast,
} from "@chakra-ui/react";

const AddMember = ({ isOpen, onClose }) => {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const toast = useToast();

  const groupId = useSelector((store) => store.group.groupId);

  const onFormSubmit = (event) => {
    event.preventDefault();

    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(API_URL(`user/${userId}/groups/${groupId}`), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          batch(() => {
            toast({
              title: "User succesfully added.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            dispatch(group.actions.setError(null));
          });
        } else {
          batch(() => {
            dispatch(group.actions.setError(data.response));
            toast({
              title: "User not found",
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
          <ModalHeader>ADD Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <form onSubmit={(event) => onFormSubmit(event)}>
                <FormLabel htmlFor="addMember">Add Member</FormLabel>
                <Input
                  placeholder="title"
                  variant="filled"
                  mb={3}
                  type="text"
                  id="addMember"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                />

                <button type="submit" onClick={!error ? "" : onClose}>
                  add member
                </button>
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddMember;
