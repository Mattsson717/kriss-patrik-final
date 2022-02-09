import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";
import { Flex, Box, Text, Image, Link, Divider } from "@chakra-ui/react";
// import { createBreakpoints } from "@chakra-ui/theme-tools";
import { useNavigate } from "react-router-dom";

import { group } from "../../reducers/group";
import Header from "../Header";

const MyGroups = () => {
  // const [group, setGroup] = useState("");

  // const groupId = useSelector((store) => store.group.groupId);
  const groupItems = useSelector((store) => store.group.items);
  const userId = useSelector((store) => store.user.userId);
  const accessToken = useSelector((store) => store.user.accessToken);
  const loggedInUser = useSelector((store) => store.user.username);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Chakra responsive
  // const breakpoints = createBreakpoints({
  //   sm: "30em",
  //   md: "48em",
  //   lg: "62em",
  //   xl: "80em",
  //   "2xl": "96em",
  // });

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
  };

  if (groupItems.length === 0) {
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
            {loggedInUser}s Groups:
          </Text>

          {groupItems.map((item) => (
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
                  <Link mb="2" p={5} onClick={() => onButtonClick(item._id)}>
                    {item.title}
                    {item.description}
                  </Link>
                </Box>
              </Box>
              <Divider orientation="vertical" borderColor="gray.300" my="2" />
            </Flex>
          ))}
        </Flex>
      </>
    );
  }
};

export default MyGroups;
