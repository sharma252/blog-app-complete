import React, { useState, useEffect } from "react";
import apiService from "../../services/api";
import BlogCard from "./BlogCard";
import LoadingSpinner from "../Common/LoadingSpinner";

const BlogList = ({ user, refreshTrigger }) => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, [refreshTrigger]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const result = await apiService.getBlogs("?limit=20");
      console.log(result);
      if (result.success) {
        const blogs = (await result.data.blogs) || [];
        setBlogs(blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (blogId) => {
    if (!user) return;

    try {
      await apiService.toggleLike(blogId);
      fetchBlogs(); // Refresh blogs to get updated like counts
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const filteredBlogs = blogs?.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner text="Loading blogs..." />;
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredBlogs.map((blog) => (
          <BlogCard
            key={blog._id}
            blog={blog}
            user={user}
            onToggleLike={handleToggleLike}
          />
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No blogs found</p>
        </div>
      )}
    </div>
  );
};

export default BlogList;
