import React from "react";
import { useNavigate, Link } from "react-router-dom";
import '../App.css';
import axios from "axios";
import useAuth from "../hooks/useAuth";


const Login = () => {
    const navigate = useNavigate();
    const { data, setData } = useAuth();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const password = e.target[1].value;
        axios.post("/login", {
            username: username,
            password: password
        }).then((response) => {
            localStorage.setItem('token', response.data.accessToken);
            const auth = true
            const user_id = response.data.user_id
            const ready = true
            setData({ auth, user_id, ready });
            navigate("/");
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
                <div className="login">
                    <h1>Login</h1>
                    <form className="login_form" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Username" />
                        <input type="password" placeholder="Password" />
                        <button>Login</button>
                    </form>
                    <Link to='/register'>Register</Link>
                    <br></br>
                    <Link to='/'>Home</Link>
                </div>
            )}
        </div>
        
    );
}

export default Login;