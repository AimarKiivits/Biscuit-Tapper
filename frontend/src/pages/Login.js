import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../App.css';
import axios from "axios";
import useAuth from "../hooks/useAuth";


const Login = () => {
    const navigate = useNavigate();
    const { setData } = useAuth();
    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const password = e.target[1].value;
        axios.post("http://localhost:5000/login", {
            username: username,
            password: password
        }).then((response) => {
            console.log(response);
            const auth = true
            setData({ auth })
            navigate("/");
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <form className="login_form" onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button>Login</button>
            </form>
            <a href="/register">Register</a>
            <br></br>
            <Link to="/">Home</Link>
        </div>
    );
}

export default Login;