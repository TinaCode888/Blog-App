import React, { useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

function EditBlog() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();

    const [blog, setBlog] = useState({
        title: state ? state.currentTitle : "",
        content: state ? state.currentContent : "",
        image: null,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setBlog((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        setBlog((prev) => ({
            ...prev,
            image: event.target.files[0],
        }));
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("title", blog.title);
            formData.append("content", blog.content);
            if (blog.image) formData.append("image", blog.image);

            const response = await axios.patch(`/blog/edit/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                console.log(response.data.message);
                navigate("/blog/add");
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            console.error("Error updating blog:", err);
        }
    };

    return (
        <div className="blog-container">
            <div className="title-menu">
                <h3>Edit Blog</h3>
                <span>
                    <Link to="/blog/add">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                            <title>Back</title>
                            <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                        </svg>
                    </Link>
                </span>
            </div>
            <div className="blog-content">
                <div className="blog-inputs">
                    <label>Update Title:</label>
                    <input
                        name="title"
                        value={blog.title}
                        className="inputs"
                        onChange={handleChange}
                    />
                    <br />
                    <label>Update Content:</label>
                    <textarea
                        name="content"
                        value={blog.content}
                        className="inputs"
                        rows="5"
                        onChange={handleChange}
                    />
                    <br />
                    <div className="add-img">
                        <label>Update Image:</label>
                        <input type="file" name="image" onChange={handleImageChange} />
                    </div>
                    <br />
                    <button className="get-started" onClick={handleUpdate}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default EditBlog;
