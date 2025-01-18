import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DeleteBlog from "./DeleteBlog";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

function UserBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);

    const fetchUserBlogs = async () => {
        try {
            const response = await axios.get("/user/blogs");
            const sortedBlogs = response.data.blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setBlogs(sortedBlogs);
        } catch (error) {
            console.error("Error fetching your blogs:", error);
        }
    };
    
    useEffect(() => {
        fetchUserBlogs();
    }, []);

    useEffect(() => {
        const handleClickOutside = () => {
            if (openMenuId) setOpenMenuId(null);
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [openMenuId]);

    const menuToggle = (event, blogId) => {
        event.stopPropagation();
        setOpenMenuId(openMenuId === blogId ? null : blogId);
    };

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    return (
        <div className="blog-container">
            <h3>Your blogs</h3>
            {blogs.map((blog) => (
                <div key={blog._id} className="blog-content">
                    <div className="blog-menu">
                        <h4 className="title">{blog.title}</h4>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={(e) => menuToggle(e, blog._id)}
                            width="18"
                            height="18"
                            fill="currentColor"
                            className="bi bi-three-dots-vertical"
                            viewBox="0 0 16 16"
                        >
                            <title>more options...</title>
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                        </svg>
                        {openMenuId === blog._id && (
                            <ul className="menu" onClick={stopPropagation}>
                                <li>
                                    <Link
                                        to={`/edit-blog/${blog._id}`} className="li" state={{ currentTitle: blog.title, currentContent: blog.content }}>
                                        Edit
                                    </Link>
                                </li>
                                <li>
                                    <DeleteBlog delId={blog._id} refetch={fetchUserBlogs} />
                                </li>
                            </ul>
                        )}
                    </div>
                    <p className="small-content">By: {blog.author.username}</p>
                    <p className="small-content">Date: {new Date(blog.createdAt).toLocaleDateString()}</p>
                    <p className="content">
                        {blog.content.substring(0, 100) + ' ... '}
                        <Link to={`/blog/${blog._id}`}>Read More</Link>
                    </p>
                    {blog.image && <img src={blog.image} alt="Blog" className="blog-image" />}
                </div>
            ))}
        </div>
    );
}

export default UserBlogs;
