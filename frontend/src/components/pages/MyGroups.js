import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";
import { Flex, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { group } from "../../reducers/group";

const MyGroups = () => {
  // const [group, setGroup] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const groupId = useSelector((store) => store.group.groupId);
  const groupItems = useSelector((store) => store.group.items);
  const userId = useSelector((store) => store.user.userId);
  const accessToken = useSelector((store) => store.user.accessToken);

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
          // dispatch(group.actions.setGroupId(data.response));
          dispatch(group.actions.setError(null));
        } else {
          dispatch(group.actions.setItems([]));
          // dispatch(group.actions.setGroupId([]));
          dispatch(group.actions.setError(data.response));
        }
      });
  }, [dispatch, accessToken, userId, groupId]);

  const onButtonClick = (groupId) => {
    dispatch(group.actions.setGroupId(groupId));
    navigate("/group");

    localStorage.setItem(groupId);
  };
  console.log("Group Items:", groupItems);

  return (
    <Flex height="vh100" alignItems="center" justifyContent="center">
      {groupItems.map((item) => (
        <Box key={item._id}>
          <button onClick={() => onButtonClick(item._id)}>{item.title}</button>

          <p>{item.title}</p>
          {/* <p>{item.task}</p> */}
          {/* onclick, POST groupId to local storage */}
        </Box>
      ))}
    </Flex>
  );
};

export default MyGroups;
