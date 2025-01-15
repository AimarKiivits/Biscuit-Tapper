import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Game from './pages/Game';
import useAuth from './hooks/useAuth';


function App() {
  const { setData } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const auth = true;
      const user_id = decoded.user_id;
      setData({ auth, user_id });
    } else {
      setData({});
    }
  }, [setData]);

  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/game' element={<Game/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
