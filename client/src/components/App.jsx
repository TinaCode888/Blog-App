import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import AddBlog from "./AddBlog";
import Blog from "./Blog";
import EditBlog from "./EditBlog";
import Post from "./Post";
import Logout from "./Logout";
import Footer from "./Footer";

function App(){
    return (
        <div className="app-container">
            <Header />
            <div className="main-content">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/blog/add" element={<AddBlog />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/edit-blog/:id" element={<EditBlog />} />
                        <Route path="/blog/:id" element={<Post />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </BrowserRouter>
            </div>
            <Footer />
        </div>
    );
}

export default App;
