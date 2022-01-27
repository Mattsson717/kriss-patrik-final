import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";
import { Flex, Box } from "@chakra-ui/react";

import { group } from "../../reducers/group";

const MyGroups = () => {
  // const [items, setItems] = useState("");
  const dispatch = useDispatch();
  const groupItems = useSelector((store) => store.group.items);
  const taskItems = useSelector((store) => store.task.items);
  const userId = useSelector((store) => store.user.userId);
  const groupId = useSelector((store) => store.task.groupId);
  const accessToken = useSelector((store) => store.user.accessToken);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    };

    // fetch groups by userId
    fetch(API_URL(`groups/${userId}`), options)
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

  //fetch tasks by groupId
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    };

    fetch(API_URL(`tasks/${groupId}`), options)
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
  }, [dispatch, accessToken, groupId]);

  return (
    <Flex height="vh100" alignItems="center" justifyContent="center">
      {groupItems.map((item) => (
        <Box key={item._id}>
          <p>{item.title}</p>
          <p>{item.description}</p>
          {/* <p>{item.task}</p> */}
        </Box>
      ))}
      {taskItems.map((item) => (
        <Box key={item._id}>
          <p>{item.title}</p>
          <p>{item.description}</p>
          {/* <p>{item.task}</p> */}
        </Box>
      ))}
    </Flex>
  );
};

export default MyGroups;
