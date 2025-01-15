import React from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

function DeleteButton(props) {
    const handleDeleteBlog = async (reqID) => {
        try {
            const response = await axios.post("/blog/delete", { id: reqID });
            if (response.data.success) {
                console.log(response.data.message);
                props.refetch(); 
            }
        } catch (err) {
            console.error("Error sending id:", err);
        }
    }

    return <p onClick={() => handleDeleteBlog(props.delId)}>Delete</p>;
}

export default DeleteButton;
