import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLike, removeBlog } from "../reducers/blogReducer";
import { Link } from "react-router-dom";

const Blog = ({ blog, blogs }) => {
  //init the datas
  const [view, setView] = useState(true);
  const [name, setName] = useState(blog.user.username);
  const user = useSelector(({ session }) => session);
  const userName = user.username;

  //call for redux dispatch
  const dispatch = useDispatch();

  //handle delete button
  const handleDelete = (blogId) => {
    const blog = blogs.find(({ id }) => id === blogId);
    if (confirm(`Confirm removing ${blog.title}`)) dispatch(removeBlog(blog));
  };

  //handle like button
  const handleLike = (blogId) => {
    const blog = blogs.find(({ id }) => id === blogId);
    dispatch(addLike(blog));
  };

  return (
    <>
      {view ? (
        <div
          onClick={() => setView(!view)}
          className="btn btn-light card text-center mt-3 pb-3 lead"
        >
          <div className="card-header">{blog.author}</div>
          <div className="card-body">
            <Link to={`blogs/${blog.id}`}>{blog.title}</Link>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setView(!view)}
          className="card gap-2 btn container text-center mt-3 pb-3 lead"
        >
          <h6 className="lead card-title pt-2">{blog.title}</h6>
          <hr class="bg-info border-2 border-top border-danger m-0" />
          <div className="mt-3">{blog.url}</div>
          <div>
            By
            <span className="card-subtitle mb-2 text-body-secondary">
              {` ${blog.author}`}
            </span>
          </div>
          <hr class="bg-info border-2 border-top border-danger" />

          <div className="column align-items-center gap-0 justify-content-evenly">
            <button
              className="btn btn-outline-danger"
              onClick={() => handleLike(blog.id)}
              value={blog.id}
            >
              <i className="bi-hand-thumbs-up"></i>
              {blog.likes}
            </button>
            {userName === name ? (
              <button
                className="btn btn-outline-dark"
                value={blog.id}
                onClick={() => handleDelete(blog.id)}
              >
                <i className="bi bi-trash"></i>
                Delete
              </button>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default Blog;
