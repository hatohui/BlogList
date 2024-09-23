import { useSelector } from "react-redux";
import Blog from "./Blog";
import { useState } from "react";

const BlogList = () => {
  const [sortByLikes, setSortByLikes] = useState(false);
  const blogs = useSelector(({ blogs }) => blogs);
  const user = useSelector(({ session }) => session);

  if (!blogs.length) return null;

  const toShow = sortByLikes
    ? [...blogs].sort((first, second) => second.likes - first.likes)
    : blogs;

  return (
    <div>
      <div>
        <button onClick={() => setSortByLikes(!sortByLikes)}>
          <span>Most Liked</span>
        </button>
      </div>
      {toShow.map((blog) => (
        <Blog key={blog.id} blog={blog} blogs={blogs} user={user} />
      ))}
    </div>
  );
};

export default BlogList;
