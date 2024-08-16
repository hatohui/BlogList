import BlogList from "../components/BlogList";
import { useState, useEffect, useRef } from "react";
import blogService from "../services/blogs";
import Notification from "../components/Notification";
import Togglable from "../components/Togglable";
import BlogCreation from "../components/BlogCreation";

const errorMessage = (message) => {
  const newMessage = message.split(",");
  const newList = newMessage.map((each) => {
    const str = each.split(":");
    return str.length === 3 ? str[2].trim() : str[1].trim();
  });
  return newList.join("\n");
};

const BlogDisplay = ({ user, setUser }) => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const viewRef = useRef();

  useEffect(() => {
    blogService.getAll().then((data) => {
      setBlogs(data);
    });
  }, []);

  const handleLogOut = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem("loggedInUser");
  };

  const handleDelete = async (event) => {
    const id = event.target.value;
    const blog = await blogService.getById(id);

    if (!window.confirm(`Do you want to delete blog titled ${blog.title}?`))
      return;

    try {
      const response = await blogService.remove(event.target.value);
      setBlogs(blogs.filter((each) => each.id != response.id));
      setMessage("Successfully removed blog!");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (error) {
      setMessage(error.response.data.error);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLike = async (event) => {
    const id = event.target.value;
    const response = await blogService.getById(id);

    const toAdjust = {
      title: response.title,
      url: response.url,
      author: response.author,
      likes: response.likes + 1,
    };

    try {
      const response = await blogService.update(id, toAdjust);
      setBlogs(
        blogs.map((blog) => (blog.id === response.id ? response : blog))
      );
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  const handleBlogCreation = async (newBlog) => {
    viewRef.current.toggleVisibility();
    try {
      const response = await blogService.create(newBlog);
      console.log(response);
      setBlogs(blogs.concat(response));
      setMessage(
        `New blog titled ${response.title} by ${response.author} has been added!`
      );
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (error) {
      console.log(error);
      setMessage(errorMessage(error.response.data.error));
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} />
      <p>
        Logged in as {user.name}{" "}
        <button onClick={handleLogOut}> Log out</button>
      </p>
      <Togglable label="Create new blog" ref={viewRef}>
        <BlogCreation
          handleBlogCreation={handleBlogCreation}
          viewRef={viewRef}
        />
      </Togglable>
      <p>Contents</p>
      <BlogList
        blogs={blogs}
        user={user}
        handleLike={handleLike}
        setMessage={setMessage}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default BlogDisplay;
