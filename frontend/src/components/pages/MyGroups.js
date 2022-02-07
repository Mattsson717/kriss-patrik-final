import React, { useEffect } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { API_URL } from "../../utils/constants";
import {
  Flex,
  Box,
  Text,
  useColorModeValue,
  Link,
  Divider,
} from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
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

  return (
    <Flex
      maxW="1000px"
      w={["90vw", "90vw", "70vw", "70vw"]}
      direction={["column", "column", "row", "row"]}
      justify={"center"}
      boxShadow={"md"}
      rounded={"lg"}
      p={4}
    >
      <Text as="h2" fontSize="xl" fontWeight="bold" mb="2">
        {loggedInUser}s Groups:
      </Text>

      {groupItems.map((item) => (
        <Flex align="center" mx="2" key={item._id}>
          <Box mx="4" border={"solid"} borderColor={"red"}>
            <Link mb="2" p={5} onClick={() => onButtonClick(item._id)}>
              {item.title}
              {/* {item.description} */}
            </Link>
          </Box>
          <Divider orientation="vertical" borderColor="gray.300" my="2" />
        </Flex>
      ))}
    </Flex>
  );
};

export default MyGroups;
