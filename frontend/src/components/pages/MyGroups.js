import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";
import { Flex, Box, Text, Image, Link, Divider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ui } from "../../reducers/ui";

import { group } from "../../reducers/group";
import Header from "../Header";

const MyGroups = () => {
  const groupItems = useSelector((store) => store.group.items);
  const userId = useSelector((store) => store.user.userId);
  const accessToken = useSelector((store) => store.user.accessToken);
  const loggedInUser = useSelector((store) => store.user.username);

  //  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Shows the logged in users GROUPS
  useEffect(() => {
    dispatch(ui.actions.setLoading(true));
    const options = {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    };

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
      })
      .finally(dispatch(ui.actions.setLoading(false)));
  }, [dispatch, accessToken, userId]);

  // Opens the specific GROUP
  const onButtonClick = (groupId) => {
    dispatch(group.actions.setGroupId(groupId));
    navigate("/group");
  };

  // If the logged in user doesnt have any groups, show this:
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
          <p>You don't have any groups yet... </p>
        </Flex>
      </>
    );
  } else {
    return (
      <>
        <Header />
        <Flex
          height="vh100"
          alignItems="center"
          justifyContent="center"
          direction={"column"}
        >
          <Text as="h2" fontSize="3xl" fontWeight="bold" mb="2">
            {loggedInUser}s Groups:
          </Text>
          <Flex
            width={600}
            w={["90vw", "90vw", "70vw", "70vw"]}
            direction={["column", "column", "row", "row"]}
            justify="center"
            p={4}
            alignItems="center"
            flexWrap="wrap"
          >
            {groupItems.map((item) => (
              <Flex justify="center" align="center" mx="2" key={item._id}>
                <Box
                  maxW="1000px"
                  direction={["column", "column", "row", "row"]}
                  justify="center"
                  boxShadow="md"
                  rounded="lg"
                  p={4}
                >
                  <Box
                    direction={"column"}
                    w={["260px", "350px", "400px", "450px"]}
                    wordBreak={"break-word"}
                  >
                    <Link mb="2" p={5} onClick={() => onButtonClick(item._id)}>
                      <Text mb="2" p={5} fontWeight="bold">
                        {item.title}
                      </Text>
                      <Text> {item.description}</Text>
                    </Link>
                  </Box>
                </Box>
                <Divider orientation="vertical" borderColor="gray.300" my="2" />
              </Flex>
            ))}
          </Flex>
        </Flex>
      </>
    );
  }
};

export default MyGroups;
