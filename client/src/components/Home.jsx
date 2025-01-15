import React from "react";
import { useNavigate } from "react-router-dom";

function Home(){
    const navigate = useNavigate();
    return (
        <div className="background-image">
            <div className="main">
                <h2>Welcome to My BlogSite!</h2>
                <button className="get-started" onClick={() => navigate("/login")}>Get Started!</button>
            </div>
        </div>
    );
}

export default Home;