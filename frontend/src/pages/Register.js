import React from "react";
import '../App.css';

const Register = () => {
    return (
        <div className="register">
            <h1>Register</h1>
            <form className="register_form">
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button>Register</button>
            </form>
            <a href="/login">Login</a>
        </div>
    );
}

export default Register;