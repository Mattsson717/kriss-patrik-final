import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";
import { task } from "../../reducers/task";
import { Input, Flex, Box, useColorModeValue } from "@chakra-ui/react";

const MyTasks = () => {
  const dispatch = useDispatch();
  const taskItems = useSelector((store) => store.task.items);
  const userId = useSelector((store) => store.user.userId);
  const accessToken = useSelector((store) => store.user.accessToken);

  const onToggleTask = (_id) => {
    dispatch(task.actions.toggleTask(_id));
  };

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
          dispatch(task.actions.setItems(data.response));
          dispatch(task.actions.setError(null));
        } else {
          dispatch(task.actions.setItems([]));
          dispatch(task.actions.setError(data.response));
        }
      });
  }, [dispatch, accessToken, userId]);

  return (
    <Flex m={3}>
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
      >
        {taskItems.map((item) => (
          <Flex key={item._id}>
            <Box
              borderColor={"black"}
              border={5}
              borderBottomStyle={"solid"}
              m={4}
            >
              {item.title}
            </Box>
          </Flex>
        ))}
      </Box>
    </Flex>
  );
};

export default MyTasks;

{
  /* <ul>
              <input
                name={item._id}
                variant="filled"
                mb={3}
                type="checkbox"
                value={item._id}
                onChange={() => onToggleTask(item._id)}
              />

              <li> {item.title} </li>
              <li> {item.description} </li>
              {/* <li> {item.group} </li> */
}
// </ul>
