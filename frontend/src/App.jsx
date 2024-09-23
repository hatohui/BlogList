import { useEffect } from "react";
import Login from "./views/Login";
import { useDispatch } from "react-redux";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, setUser } from "./reducers/sessionReducer";
import BlogDisplay from "./views/BlogDisplay";
import { initializeBlogs } from "./reducers/blogReducer";
import UserView from "./views/UserView";
import ErrorPage from "./views/ErrorPage";
import IndividualUserDisplay from "./views/IndividualUserDisplay";
import IndividualBlogView from "./views/IndividualBlogView";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const location = useLocation();

  //check saved user and get data
  useEffect(() => {
    const loggedInUser = window.localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      dispatch(setUser(user));
    }
  }, []);

  //init blog datas
  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  //check userLogin
  useEffect(() => {
    if (loggedIn && location.pathname == "/") {
      navigate("/");
    } else if (location.pathname == "/") {
      navigate("/login");
    }
  }, [navigate, loggedIn]);

  return (
    <Routes>
      <Route path="login" element={<Login />}></Route>
      <Route path="users" element={<UserView />}></Route>
      <Route
        exact
        path="/users/:id"
        element={<IndividualUserDisplay />}
      ></Route>
      <Route path="/blogs/:id" element={<IndividualBlogView />}></Route>
      <Route path="/" element={<BlogDisplay />}></Route>
      <Route path="*" element={<ErrorPage />}></Route>
    </Routes>
  );
};

export default App;
