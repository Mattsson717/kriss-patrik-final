import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

import Start from "./components/Start";
import Login from "./components/Login";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import CreateGroup from "./components/pages/CreateGroup";
import MyGroups from "./components/pages/MyGroups";
import MyTasks from "./components/pages/MyTasks";
import Group from "./components/pages/Group";
import Header from "./components/Header";

import user from "./reducers/user";
import { group } from "./reducers/group";
import { task } from "./reducers/task";

const reducer = combineReducers({
  user: user.reducer,
  group: group.reducer,
  task: task.reducer,
});

const store = configureStore({ reducer });

export const App = () => {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <ColorModeScript initialColorMode="light"></ColorModeScript>
        <BrowserRouter>
          <Header />
          <Routes>
            {/* {path === "/" ?  : <Header />} */}
            <Route path="/" element={<Start />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/tasks" element={<MyTasks />} />
            <Route path="/groups" element={<MyGroups />} />
            <Route path="/group" element={<Group />} />
            <Route path="/createGroup" element={<CreateGroup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  );
};
