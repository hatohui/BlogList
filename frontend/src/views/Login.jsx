import loginService from "../services/login";
import blogService from "../services/blogs";
import Notification from "../components/Notification";
import useField from "../hooks/useField";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { setUser, userLogin } from "../reducers/sessionReducer";

const Login = () => {
  const { reset: resetUsername, ...username } = useField("text");
  const { reset: resetPassword, ...password } = useField("password");
  const dispatch = useDispatch();

  //handle the login
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value,
      });
      //save to local storage
      dispatch(userLogin(user));
      //set the current ones
      blogService.setToken(user.token);
      resetUsername, resetPassword;
    } catch (exception) {
      const message = exception.response.data.error;
      console.log(message);
      dispatch(setNotification(message));
    }
  };

  //return the component
  return (
    <div>
      <h2>Login to application</h2>
      <form onSubmit={handleLogin}>
        <Notification />
        <p>
          Username <input {...username}></input>
        </p>
        <p>
          Password <input {...password}></input>
        </p>
        <button type="submit"> Login</button>
      </form>
    </div>
  );
};

export default Login;
