import React from "react";
import '../App.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Register = () => {
    const navigate = useNavigate();
    const { data, setData } = useAuth();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const password = e.target[1].value;
        axios.post("/register", {
            username: username,
            password: password
        }).then((response) => {
            console.log(response);
            navigate("/login");
        }).catch((error) => {
            console.log(error);
        });
    }

    const logout = () => {
        setData({});
        localStorage.removeItem('token');
        navigate("/");
    }

    return (
        <div>
            {data.auth ? (
                <div> 
                    <h1>Already logged in</h1>
                    <div>
                        <button onClick={logout}>Log out</button>
                    </div>
                    <Link to='/'>Home</Link>
                </div>
            ) : (
                <div className="register">
                    <h1>Register</h1>
                    <form className="register_form" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Username" />
                        <input type="password" placeholder="Password" />
                        <button>Register</button>
                    </form>
                    <Link to='/login'>Log in</Link>
                    <br></br>
                    <Link to='/'>Home</Link>
                </div>
            )}
        </div>        
    );
}

export default Register;