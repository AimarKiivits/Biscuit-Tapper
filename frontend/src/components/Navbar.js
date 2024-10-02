import React from "react";
import '../App.css';

const Navbar = () => {
    return (
        <div className="navbar">
            <h1>Navbar</h1>
            <div className="user_area">
                <button>Login</button>
                <button>Register</button>
            </div>
        </div>
    );
}

export default Navbar;