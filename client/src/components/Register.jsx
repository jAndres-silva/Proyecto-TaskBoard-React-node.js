//Componente Register

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar el mensaje de error antes de hacer la solicitud

    // Validar campos
    if (!name || !user || !pass) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      await axios.post('http://localhost:3000/register', { name, user, pass });
      // Si el registro fue exitoso, redirigir al usuario a la página de inicio de sesión
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      // Manejar errores de registro
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Error al procesar la solicitud de registro');
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 shadow-lg p-3 mb-5">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">Registrarse</div>
            <div className="card-body text-primary">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>        
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre completo</label>
                  <input 
                    id="name" 
                    name="name" 
                    type="text" 
                    className="form-control" 
                    aria-describedby="emailHelp"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />              
                </div>
                <div className="mb-3">
                  <label htmlFor="user" className="form-label">Cuenta de usuario</label>
                  <input 
                    id="user" 
                    name="user" 
                    type="text" 
                    className="form-control"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="pass" className="form-label">Password</label>
                  <input 
                    id="pass" 
                    name="pass" 
                    type="password" 
                    className="form-control"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>
                <div className="card-footer bg-transparent border-primary">
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Registrar</button>
                </div>
              </form>
            </div>
          </div>   
        </div>
      </div>
    </div>
  );
};

export default Register;