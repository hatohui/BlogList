import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../reducers/sessionReducer";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const user = useSelector(({ session }) => session);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(userLogout());
    navigate("/login");
  };
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid ml-5">
        <Link className="navbar-brand" to="/">
          ColonDee
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                to="/"
                className="nav-link active text-center"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-center" to="/users">
                Users
              </Link>
            </li>
          </ul>
          <div className="d-flex gap-3 nav-item me-2 justify-content-evenly">
            <div className="d-flex gap-2 mt-2">
              <span>Logged in as:</span>
              <span style={{ color: "blue" }}> {user.name}</span>
            </div>
            <button onClick={handleLogOut} className="btn btn-outline-success ">
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
