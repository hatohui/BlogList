import BlogList from "../components/BlogList";
import { useRef } from "react";
import Notification from "../components/Notification";
import Togglable from "../components/Togglable";
import BlogCreation from "../components/BlogCreation";
import NavBar from "../components/NavBar";

const BlogDisplay = () => {
  //get current user
  const viewRef = useRef();

  return (
    <>
      <NavBar />
      <div className="container-fluid text-center w-100">
        <div className="row">
          <div className="col-sm">
            <div className="mt-3">
              <h3>ColonDee App</h3>
            </div>
          </div>
          <div className="col-sm-6">
            <Togglable label="Create new blog" ref={viewRef}>
              <BlogCreation viewRef={viewRef} />
            </Togglable>
            <p>Contents</p>
            <BlogList />
          </div>
          <div className="col-sm">
            <Notification />
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDisplay;
