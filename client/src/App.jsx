//App.jsx ---

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Index";
import Register from "./components/Register";
import ProfilePage from "./components/profile/Profile";



const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSuccessfulLogin = (token, userData) => {
    setIsAuthenticated(true);
    localStorage.setItem("jwtToken", token);
    setUser(userData); // Actualiza el estado del usuario
  };
 
const handleLogout = () => {
  document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  setUser(null);
  setIsAuthenticated(false);
};

useEffect(() => {
  const jwtToken = getCookie("jwtToken");
  if (jwtToken) {
    setIsAuthenticated(true);
  }
}, []);

// Función auxiliar para obtener el valor de una cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleSuccessfulLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard user={user} isAuthenticated={true} onLogout={handleLogout} />} />
        <Route path="/profile" element={<ProfilePage user={user}/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;