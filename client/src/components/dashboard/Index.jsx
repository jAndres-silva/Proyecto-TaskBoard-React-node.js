//Componente Dashboard

import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import ProfilePage from "../profile/Profile";
import { BiTask } from "react-icons/bi";
import TaskManager from '../taskmanager/TaskManager';
import "./Index.css";

const SidebarLink = ({ text, onClick }) => (
  <li className="nav-item" style={{ marginTop: "10px" }}>
    <button className="nav-link" onClick={onClick} style={{ color: "white" }}>
      {text === "Tareas" && <BiTask className="me-2" />}
      {text}
    </button>
  </li>
);

const Dashboard = ({ user, isAuthenticated, onLogout }) => {
  const [userName, setUserName] = useState("");
  const [activeComponent, setActiveComponent] = useState(null);
  const [logoutRedirect, setLogoutRedirect] = useState(false);

  useEffect(() => {
    console.log("user en useEffect:", user);
    if (user && user.name) {
      setUserName(user.name);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      document.cookie =
        "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      const response = await axios.get("/logout");
      if (response.status === 200) {
        console.log(response.data.message);
        setLogoutRedirect(true);
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (logoutRedirect) {
    return <Navigate to="/" />;
  }

  const handleSidebarItemClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const renderSidebarComponent = () => {
    switch (activeComponent) {
      case "tasks":
        return <TaskManager />;
      case "profile":
        return <ProfilePage user={user} />; // Pasando el objeto user como prop
      default:
        return null;
    }
  };

  return (
    <>
      <header className="navbar navbar-dark sticky-top bg-primary flex-md-nowrap p-0 shadow">
        <Link to="/" className="navbar-brand col-md-3 col-lg-2 me-0 px-3">
        TaskMaster
        </Link>
        <button
          className="navbar-toggler position-absolute d-md-none collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-nav">
          <div className="nav-item text-nowrap">
            <button onClick={handleLogout} className="px-3 btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container-fluid">
        <div className="row">
          <nav
            id="sidebarMenu"
            className="col-md-3 col-lg-2 d-md-block bg-primary sidebar collapse"
          >
            <div className="position-sticky pt-3">
              <ul className="nav flex-column">
                <SidebarLink
                  text="Dashboard"
                  onClick={() => handleSidebarItemClick(null)}
                />
                <SidebarLink
                  text="Tareas"
                  onClick={() => handleSidebarItemClick("tasks")}
                />
                <SidebarLink
                  text="Perfil de Usuario"
                  onClick={() => handleSidebarItemClick("profile")}
                />
              </ul>
            </div>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h2>Dashboard</h2>
              <h2>
                Bienvenido: <span className="badge bg-success">{userName}</span>
              </h2>
            </div>

            {renderSidebarComponent()}

            {activeComponent === null && (
              <div>
                <h2>Contenido del Dashboard</h2>
                <p>contenido específico del Dashboard.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
