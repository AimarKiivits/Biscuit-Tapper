import React from "react";
import '../App.css';

const Login = () => {
    return (
        <div className="login">
            <h1>Login</h1>
            <form className="login_form">
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button>Login</button>
            </form>
            <a href="/register">Register</a>
        </div>
    );
}

export default Login;