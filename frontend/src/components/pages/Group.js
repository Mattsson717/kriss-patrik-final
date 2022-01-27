import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";
import { Flex, Box } from "@chakra-ui/react";

import { group } from "../../reducers/group";
import { task } from "../../reducers/task";

const Group = () => {
  // const [items, setItems] = useState("");
  const dispatch = useDispatch();

  const taskItems = useSelector((store) => store.task.items);

  const groupId = useSelector((store) => store.task.groupId);
  const accessToken = useSelector((store) => store.user.accessToken);

  //fetch tasks by groupId
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    };

    fetch(API_URL(`tasks/${groupId}`), options) //get groupId that was posted with button in Mygroups
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
  }, [dispatch, accessToken, groupId]);

  return (
    <Flex height="vh100" alignItems="center" justifyContent="center">
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

export default Group;
