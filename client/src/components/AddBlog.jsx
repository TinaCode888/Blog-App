import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserBlogs from "./UserBlogs";
import Logout from "./Logout";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

function AddBlog() {
    const navigate = useNavigate();
    const [isExpand, setIsExpand] = useState(false);
    const [addBlog, setAddBlog] = useState({
        title: "",
        content: "",
        image: null
    });

    const expand = () => {
        setIsExpand(true);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAddBlog((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("title", addBlog.title);
        formData.append("content", addBlog.content);
        if (addBlog.image) {
            formData.append("image", addBlog.image);
        }
    
        try {
            const response = await axios.post("/blog/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
    
            if (response.data.success) {
                navigate("/blog");
                console.log(response.data.message);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error adding blog:", error.response?.data || error.message);
            alert(error.response?.data.message || "Failed to add blog. Please ensure you are logged in.");
        }
    
        setAddBlog({ title: "", content: "", image: null });
    };
    
    return (
        <div>
            <div className="blog-container">
                <div className="title-menu">
                    <h3>Compose your blog</h3>
                    <span>
                        <Link to="/blog">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                                <title>Back</title>
                                <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                            </svg>
                        </Link>
                    </span>
                </div>
                <div className="blog-content">
                    <form onSubmit={handleSubmit}>
                        <div className="blog-inputs">
                            {isExpand ? (
                                <input
                                    name="title"
                                    value={addBlog.title}
                                    className="inputs"
                                    onChange={handleChange}
                                    placeholder="Add Blog Title"
                                /> 
                            ) : null}

                            <textarea
                                name="content"
                                value={addBlog.content}
                                className="inputs"
                                onChange={handleChange}
                                onClick={expand}
                                rows={isExpand? 3 : 1}
                                placeholder="Add Blog Content here..."
                            />

                            {isExpand && (
                                <div>
                                    <label>Add Image:</label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/jpeg,image/png"
                                        onChange={(e) => setAddBlog({ ...addBlog, image: e.target.files[0] })}
                                    />
                                </div>
                            )}

                        </div>

                        {isExpand ? (
                            <button className="add-button" type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                    <title>Add</title>
                                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                </svg>
                            </button>
                        ) : null}   
                    </form>
                </div>
                <Logout />
            </div>
            <UserBlogs />
        </div>
    );
}

export default AddBlog;
