import React from "react";
import '../App.css';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const password = e.target[1].value;
        axios.post("http://localhost:5000/register", {
            username: username,
            password: password
        }).then((response) => {
            console.log(response);
            navigate("/login");
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className="register">
            <h1>Register</h1>
            <form className="register_form" onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button>Register</button>
            </form>
            <a href="/login">Login</a>
            <br></br>
            <a href="/">Home</a>
            <Link to="/login">Login</Link>
        </div>
    );
}

export default Register;