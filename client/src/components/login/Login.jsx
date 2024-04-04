// Componente lOGIN

import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "./styles.css";

const Login = ({ onLoginSuccess }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      console.log("Enviando solicitud de inicio de sesión:", { user, pass });
      const response = await axios.post("http://localhost:3000/login", { user, pass });
      console.log("Respuesta del servidor:", response.data);
  
      if (response.data.success) {
        const token = response.data.token;
        // Almacenar el token en una cookie
        document.cookie = `jwtToken=${token}; path=/`;
        Swal.fire({
          title: "¡Inicio de sesión exitoso!",
          text: "Serás redirigido al dashboard.",
          icon: "success",
          timer: 2000,
          confirmButtonText: false,
        }).then(() => {
          onLoginSuccess(token, response.data.user); // Pasa los datos del usuario
          navigate("/dashboard");
        });
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
    }
  };

  return (
    <main className="form-signin text-center shadow-lg p-3 mb-5">
      <form id="formLogin" onSubmit={handleSubmit}>
        <img className="mb-4" src="/login.svg" alt="" width="72" height="57" />
        {error && <div className="alert alert-danger">{error}</div>} {/* Mostrar el mensaje de error */}
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="user"
            name="user"
            placeholder="User"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <label htmlFor="user">User</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="pass"
            name="pass"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <label htmlFor="pass">Password</label>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Login
        </button>
      </form>
      <br />
      <a href="/register" className="w-100 btn btn-lg btn-bd-primary">
        Registrarse
      </a>
    </main>
  );
};

export default Login;
