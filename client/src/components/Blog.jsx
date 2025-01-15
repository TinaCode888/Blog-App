import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

function Blog(){
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get("/blogs");
                const sortedBlogs = response.data.blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setBlogs(sortedBlogs);
            } catch (error) {
                console.log(error);
            }
        };                
        fetchBlogs();
    }, []);

    return (
        <div className="blog-container">
            <div className="title-menu">
                <h3>Blogs</h3>
                <span>
                    <Link to="/blog/add">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <title>Compose a Blog</title>
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </Link>
                </span>
            </div>
            {blogs.map((blog) => (
                <div key={blog._id} className="blog-content">
                    <h4 className="title">{blog.title}</h4>
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

export default Blog;