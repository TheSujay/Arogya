import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import "../styles/BlogSection.css"; // Ensure you have the correct path to your CSS file

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/blogs`);
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [backendUrl]);

  return (
    <section className="container">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
          🏥 Arogya <span className="text-blue-600">Blog</span> Highlights
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Read the latest medical tech stories and management tips from our experts.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
        </div>
      ) : (
        <div className="card__container">
          {blogs.map((blog, index) => (
            <article className="card__article" key={index}>
              <img
                src={blog.image}
                alt={blog.title}
                className="card__img"
              />
              <div className="card__data">
  <span className="card__description">{blog.authorName || "Unknown Author"}</span>
  <h3 className="card__title">{blog.title}</h3>
  <p className="card__description">{blog.content}</p>
  {/* Author Info */}
  {(blog.authorName || blog.authorBio || blog.authorAvatar) && (
    <div className="card__author" style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
      {blog.authorAvatar ? (
        <img
          src={blog.authorAvatar}
          alt={blog.authorName || "Author Avatar"}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #eee"
          }}
        />
      ) : (
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#888",
          fontSize: "1.5rem"
        }}>?</div>
      )}
      <div>
        <p className="font-semibold" style={{ margin: 0 }}>{blog.authorName || "Unknown Author"}</p>
        <p className="text-sm" style={{ margin: 0, color: "#888" }}>{blog.authorBio || "No bio provided."}</p>
      </div>
    </div>
  )}
  <a href={`/blog/${blog._id}`} className="card__button">
    Read More
  </a>
</div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogSection;