import { useState } from "react";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";

const BlogCreation = () => {
  const [blogToCreate, setBlogToCreate] = useState({
    title: "",
    author: "",
    url: "",
  });

  const dispatch = useDispatch();

  const handleChange = (event) => {
    setBlogToCreate({
      ...blogToCreate,
      [event.target.id]: event.target.value,
    });
  };

  const handleCreation = (event) => {
    event.preventDefault();
    dispatch(createBlog(blogToCreate));
    setBlogToCreate({
      title: "",
      author: "",
      url: "",
    });
  };

  return (
    <form onSubmit={handleCreation}>
      <div className="d-flex row gap-2 form-control mt-3">
        <h3>Create a new blog</h3>
        <div className="input-group">
          <div className="input-group-text">Title </div>
          <input
            data-testid="title"
            id="title"
            type="text"
            className="form-control"
            value={blogToCreate.title}
            onChange={handleChange}
          ></input>
        </div>
        <div className="input-group">
          <div className="input-group-text">Author </div>
          <input
            data-testid="author"
            id="author"
            type="text"
            className="form-control"
            value={blogToCreate.author}
            onChange={handleChange}
          ></input>
        </div>
        <div className="input-group">
          <div className="input-group-text">Link</div>
          <input
            data-testid="url"
            id="url"
            className="form-control"
            type="text"
            value={blogToCreate.url}
            onChange={handleChange}
          ></input>
        </div>
        <button
          data-testid="submit"
          type="submit"
          className="btn btn-primary ml-2"
        >
          BLOG
        </button>
      </div>
    </form>
  );
};

export default BlogCreation;
