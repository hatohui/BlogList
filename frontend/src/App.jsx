import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import Login from "./views/Login";
import BlogDisplay from "./views/BlogDisplay";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { setUser, userLogout } from "./reducers/sessionReducer";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  const user = useSelector(({ session }) => session);
  console.log("hello", user);

  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
    </Routes>
  );
};

export default App;
