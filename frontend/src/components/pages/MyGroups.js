import React, { useEffect } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { API_URL } from "../../utils/constants";
import { Flex, Box, Text, useColorModeValue, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { group } from "../../reducers/group";

const MyGroups = () => {
  // const [group, setGroup] = useState("");

  // const groupId = useSelector((store) => store.group.groupId);
  const groupItems = useSelector((store) => store.group.items);
  const userId = useSelector((store) => store.user.userId);
  const accessToken = useSelector((store) => store.user.accessToken);
  const loggedInUser = useSelector((store) => store.user.username);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    };

    // fetch groups by userId
    fetch(API_URL(`groups/user/${userId}`), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          dispatch(group.actions.setItems(data.response));
          dispatch(group.actions.setGroupId(data.response));
          dispatch(group.actions.setError(null));
        } else {
          dispatch(group.actions.setItems([]));
          dispatch(group.actions.setGroupId([]));
          dispatch(group.actions.setError(data.response));
        }
      });
  }, [dispatch, accessToken, userId]);

  const onButtonClick = (groupId) => {
    dispatch(group.actions.setGroupId(groupId));
    navigate("/group");

    localStorage.setItem("group", groupId);
    // Do we need this? Maks removed it from group.js
  };

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
        <Text>{loggedInUser}s Tasks:</Text>
        {groupItems.map((item) => (
          <Flex key={item._id}>
            <Box m={2} w={"80%"} p={2} rounded={"lg"} bg={"teal"}>
              <Button onClick={() => onButtonClick(item._id)}>
                {item.title}
                {item.description}
              </Button>

              {/* <p>{item.task}</p> */}
              {/* onclick, POST groupId to local storage */}
            </Box>
          </Flex>
        ))}
      </Box>
    </Flex>
  );
};

export default MyGroups;
