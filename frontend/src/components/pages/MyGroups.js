import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../utils/constants";
import { Flex, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { group } from "../../reducers/group";

const MyGroups = () => {
  // const [items, setItems] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const onButtonClick = () => {
    dispatch(group.actions.setGroupId());
    navigate("/group");

    localStorage.addItem("group");
  };

  return (
    <Flex height="vh100" alignItems="center" justifyContent="center">
      {groupItems.map((item) => (
        <Box key={item._id}>
          <button onClick={() => onButtonClick()}>{item.title}</button>
          <p>{item.description}</p>
          {/* <p>{item.task}</p> */}
          {/* onclick, POST groupId to local storage */}
        </Box>
      ))}
    </Flex>
  );
};

export default MyGroups;
