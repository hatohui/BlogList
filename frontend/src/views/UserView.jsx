import Notification from "../components/Notification";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../style/userViewStyle.css";
import NavBar from "../components/NavBar";
import { useEffect } from "react";
import { getUsers } from "../reducers/userReducer";

const UserView = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  });
  const users = useSelector(({ users }) => users);

  return (
    <>
      <NavBar />
      <Notification />
      <h2>Users</h2>
      <div>
        <div className="column">
          <div style={{ width: "150px" }}>
            <b> Usernames </b>
          </div>
          <div>
            <b>Blogs Created</b>
          </div>
        </div>
        {users.map((user) => (
          <div className="column" key={user.id}>
            <div className="name">
              <Link to={user.id}>{user.name}</Link>
            </div>
            <div className="data">{user.blogs.length}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserView;
