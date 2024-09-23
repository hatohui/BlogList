import { useParams } from "react-router-dom";
import Notification from "../components/Notification";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import blogService from "../services/blogs";
import ErrorPageComp from "../components/ErrorPageComp";
import { useSelector } from "react-redux";

const IndividualBlogView = () => {
  const { id } = useParams();
  const user = useSelector(({ session }) => session);
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    blogService
      .getById(id)
      .then((returned) => setBlog(returned))
      .catch(() => setBlog(null));
  }, []);

  const handleComment = (event) => {
    event.preventDefault();
    setComments([...comments].concat(comment));
    setComment("");
  };

  const handleChange = (event) => setComment(event.target.value);

  if (!blog) return <ErrorPageComp />;
  return (
    <>
      <NavBar />
      <div className="container-fluid">
        <Notification />
        Blog View ID: {id}
        <div className="row">
          <div id="info" className="lead col-md" style={{ paddingLeft: 10 }}>
            <div className="mb-3 justify-content-center ml-4">
              <hr></hr>
              <label className="col-sm-2 h6 col-form-label">{blog.title}</label>
              <div>Likes: {blog.likes}</div>
              <div>Link: {blog.url} </div>
              <div>Author: {blog.author}</div>
            </div>
          </div>
          <hr className="mt-4"></hr>
          <div className="col">
            <form className="form" onSubmit={handleComment}>
              <div className="form-floating">
                <textarea
                  className="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                  value={comment}
                  onChange={handleChange}
                  style={{ height: "100px" }}
                ></textarea>
                <label>Comments</label>
              </div>
              <button className="btn btn-primary mt-2"> Post</button>
            </form>
          </div>
          <div className="col">
            <ul className="list-group">
              {comments.map((each, index) => (
                <li className="list-group-item mt-2" key={index}>
                  <div>{user.name}:</div>
                  <div className="lead">{each}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
export default IndividualBlogView;
