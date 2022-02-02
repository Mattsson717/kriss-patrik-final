import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";
import { Flex, Box } from "@chakra-ui/react";

// import { group } from "../../reducers/group";
import { group } from "../../reducers/group";

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

  console.log("Group Items:", groupItems);
  // console.log("Task Items:", taskItems);

  // const displayTasks = groupItems.map((group) =>
  //   group.task.map((task) => task.items)
  // );
  // console.log("display task:", displayTasks);
  return (
    <Flex height="vh100" alignItems="center" justifyContent="center">
      {groupItems.map((item) => (
        <Box key={item._id}>
          <p>Title: {item.title}</p>
          <p>Description: {item.description}</p>

          {/* <p>{item.createdAt}</p> */}
        </Box>
      ))}
    </Flex>
  );
};

export default Group;
