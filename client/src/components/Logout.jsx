import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post("/logout");
            localStorage.removeItem("token");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button onClick={handleLogout} className="logout-button">
            Logout
        </button>
    );
}

export default Logout;
