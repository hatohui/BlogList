import Notification from "../components/Notification";
import useField from "../hooks/useField";
import { useDispatch } from "react-redux";
import { isLoggedIn, userLogin, setUser } from "../reducers/sessionReducer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const { reset: resetUsername, ...username } = useField("text");
  const { reset: resetPassword, ...password } = useField("password");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const check = isLoggedIn();

  useEffect(() => {
    if (check) navigate(-1);
  }, []);

  //handle the login
  const handleLogin = async (event) => {
    event.preventDefault();
    const user = {
      username: username.value,
      password: password.value,
    };
    //save to local storage
    dispatch(userLogin(user, navigate));
    //set the current ones
    resetUsername, resetPassword;
  };

  //return the component
  return (
    <>
      <div
        id="FormContainer"
        className="d-flex flex-column justify-content-center align-items-center vh-100"
      >
        <h2>Login to BlogList</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div className="form-group mt-2">
            <label className=" form-label">Username</label>
            <input
              id="username"
              className="form-control"
              placeholder="e.g hatohui"
              style={{ minWidth: 300 }}
              {...username}
            ></input>
          </div>
          <br></br>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="password"
              className="form-control"
              placeholder="e.g thisisagoodpassword"
              {...password}
            ></input>
          </div>
          <button className="btn btn-primary mt-4 form-control" type="submit">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
