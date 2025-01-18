import React from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

function DeleteBlog(props) {
    const handleDeleteBlog = async (reqID) => {
        try {
            const response = await axios.delete(`/blog/delete/${reqID}`);
            if (response.data.success) {
                console.log(response.data.message);
                props.refetch(); 
            }
        } catch (err) {
            alert("Error deleting blog:", err);
        }
    }

    return <p onClick={() => handleDeleteBlog(props.delId)}>Delete</p>;
}

export default DeleteBlog;
