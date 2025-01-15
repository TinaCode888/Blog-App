import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login(){
    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    });
    const navigate = useNavigate();

    function handleChange(event){
        const {name, value} = event.target;
        setLoginData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/login", loginData);
            console.log("data sent successfully!!", response.data);
            if (response.data.success) {
                navigate("/blog");
                console.log(response.data.success);
            } else {
                console.log("login failed: ", response.data.message);
            }
        } catch(error) {
            console.error("error: ", error);
        }
        
        setLoginData({
            username: "",
            password: ""
        });
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input name="username" onChange={handleChange} type="text" placeholder="Username" value={loginData.username}/>
                <input name="password" onChange={handleChange} type="password" placeholder="Password" value={loginData.password} />
                <button type="submit">Submit</button>
                <a href="/register">Don't have an Account? Register Here!</a>
                <a href="/">Back to Homepage</a>
            </form>
        </div>
    );
}

export default Login;