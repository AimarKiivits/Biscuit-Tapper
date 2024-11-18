import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import useAuth from "../hooks/useAuth";

const Home = () => {
    const navigate = useNavigate();
    const { data } = useAuth();
    return (
        <div>
        {data.auth ? (
            <div> 
                <div>
                    <button onClick={() => navigate('/game')}>Play</button>
                </div>
                <div> 
                    <p className="quip">Totally original game</p>
                </div>
            </div>
        ) : (
            <div>
                <button onClick={() => navigate("/login")}>To Login</button>
                <button onClick={() => navigate("/register")}>To Register</button>
            </div>
        )}    
        </div>
        
        
    );
}

export default Home;