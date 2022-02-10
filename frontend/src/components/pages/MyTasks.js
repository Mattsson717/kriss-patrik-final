import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";
import { group } from "../../reducers/group";
import { Flex, Box, Text, Image } from "@chakra-ui/react";
import Header from "../Header";

const MyTasks = () => {
  const dispatch = useDispatch();
  const taskItems = useSelector((store) => store.group.items);
  const userId = useSelector((store) => store.user.userId);
  const accessToken = useSelector((store) => store.user.accessToken);
  const loggedInUser = useSelector((store) => store.user.username);

  // Shows the logged in users TASKS
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    };
    fetch(API_URL(`tasks/${userId}`), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          dispatch(group.actions.setItems(data.response));
          dispatch(group.actions.setError(null));
        } else {
          dispatch(group.actions.setItems([]));
          dispatch(group.actions.setError(data.response));
        }
      });
  }, [dispatch, accessToken, userId]);

  // If the logged in user doesnt have any tasks, show this:
  if (taskItems.length === 0) {
    return (
      <>
        <Header />
        <Flex
          w={["90vw", "90vw", "70vw", "70vw"]}
          direction={["column", "column", "row", "row"]}
          justifyContent="center"
          p={4}
          alignItems="center"
        >
          <Image
            width={300}
            src="https://i.ibb.co/qdwgc0h/Pngtree-hand-drawn-heart-shaped-heart-outline-6044489.png"
          />
          <p>You have'nt accepted any tasks yet... </p>
        </Flex>
      </>
    );
  } else {
    return (
      <>
        <Header />
        <Flex
          maxW="1000px"
          w={["90vw", "90vw", "70vw", "70vw"]}
          direction={["column", "column", "row", "row"]}
          justify="center"
          p={4}
        >
          <Text as="h2" fontSize="xl" fontWeight="bold" mb="2">
            {loggedInUser}s Tasks:
          </Text>

          {taskItems.map((item) => (
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
                <Box direction={"column"}>
                  <Text mb="2" p={5}>
                    {item.title}
                    {item.description}
                  </Text>
                </Box>
              </Box>
            </Flex>
          ))}
        </Flex>
      </>
    );
  }
};

export default MyTasks;
