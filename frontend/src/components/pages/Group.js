import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";
import {  
  Flex,
  Box,
  useColorModeValue,
  Stack,
  Checkbox, 
} from "@chakra-ui/react";

// import { group } from "../../reducers/group";
import { group } from "../../reducers/group";
import { onToggleTask } from "../../reducers/task";

const Group = () => {
  // const [items, setItems] = useState("");
  const dispatch = useDispatch();

  const groupItems = useSelector((store) => store.group.items);
  // const taskItems = useSelector((store) => store.group.task);

  const groupId = useSelector((store) => store.group.groupId);
  const accessToken = useSelector((store) => store.user.accessToken);

  //fetch tasks by groupId
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    };

    fetch(API_URL(`tasks/group/${groupId}`), options) //get groupId that was posted with button in Mygroups
      .then((res) => res.json())
      .then((data) => {
        console.log("Specific Group ID :", groupId);
        if (data.success) {
          dispatch(group.actions.setItems(data.response));
          dispatch(group.actions.setError(null));
        } else {
          dispatch(group.actions.setItems([]));
          dispatch(group.actions.setError(data.response));
        }
      });
  }, [dispatch, accessToken, groupId]);

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
        {groupItems.map((item) => (
          <Box key={item._id}>
            <p>Title: {item.title}</p>
            <p>Description: {item.description}</p>
            <Stack spacing={5} direction="row">
              <Checkbox
                colorScheme="teal"
                name={item._id}
                variant="filled"
                mb={3}
                type="checkbox"
                value={item._id}
                checked={item.taken}
                onChange={() => dispatch(onToggleTask(item._id, item.taken))}
              />
            </Stack>
            {/* <p>{item.createdAt}</p> */}
          </Box>
        ))}
      </Box>
    </Flex>
  );
};

export default Group;
