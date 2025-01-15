import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register(){
    const [registerData, setRegisterData] = useState({
        username: "",
        password: "",
        confirmPwd: ""
    });

    const navigate = useNavigate();

    function handleChange(event){
        const {name, value} = event.target;

        setRegisterData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:3001/register", registerData);
            console.log("data sent successfully!!", response.data);
            if (response.data.success) {
                navigate("/blog");
                console.log(response.data.success);
            } else {
                console.log("Registration failed: ", response.data.message);
            }
        } catch(error) {
            console.error("error: ", error);
        }

        setRegisterData({
            username: "",
            password: "",
            confirmPwd: ""
        });
    };

    return (
        <div className="login-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input name="username" onChange={handleChange} type="email" placeholder="Username" value={registerData.username} />
                <input name="password" onChange={handleChange} type="password" placeholder="Password" value={registerData.password} />
                <input name="confirmPwd" onChange={handleChange} type="password" placeholder="Confirm Password" value={registerData.confirmPwd} />
                <button type="submit">Submit</button>
                <a href="/login">Already have an Account? Login Now!</a>
            </form>
        </div>
    );
}

export default Register;