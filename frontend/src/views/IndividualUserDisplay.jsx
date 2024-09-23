import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import userService from "../services/users";
import ErrorPageComp from "../components/ErrorPageComp";
import NavBar from "../components/NavBar";

const IndividualUserDisplay = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService
      .getById(id)
      .then((data) => setUser(data))
      .catch((error) => setUser(null));
  }, []);

  if (!user) return <ErrorPageComp />;

  return (
    <>
      <NavBar />
      <div>
        <h3>{user.name}</h3>
        <b>added blogs</b>
        <ul>
          {user.blogs.map((each) => {
            return <li key={each.id}> {each.title}</li>;
          })}
        </ul>
      </div>
    </>
  );
};

export default IndividualUserDisplay;
