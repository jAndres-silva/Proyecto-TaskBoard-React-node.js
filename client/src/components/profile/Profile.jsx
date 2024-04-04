import axios from "axios";
import React, { useState } from "react";

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
} from "mdb-react-ui-kit";

export default function ProfilePage({ user }) {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    celular: user?.celular || "",
    direccion: user?.direccion || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jwtToken = getCookie("jwt");
    console.log("JWT Token:", jwtToken);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/users/${user.id}`,
        formData
      );
      if (response.data.success) {
        setMessage("Datos actualizados correctamente");
      } else {
        setMessage("Error al actualizar los datos");
      }
    } catch (error) {
      setMessage("Error al actualizar los datos");
      console.error(error);
    }
  };
  {
    message && (
      <div
        className={`alert ${
          message.includes("Error") ? "alert-danger" : "alert-success"
        }`}
      >
        {message}
      </div>
    );
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("photo", file);
        const response = await axios.post(
          `/api/users/${user.id}/photo`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          setMessage("Foto de perfil actualizada correctamente");
        } else {
          setMessage("Error al actualizar la foto de perfil");
        }
      } catch (error) {
        setMessage("Error al actualizar la foto de perfil");
        console.error(error);
      }
    }
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol>
            <div className="bg-info rounded p-4 mb-4 text-center">
              <h2 className="text-white">Mi Perfil</h2>
              <p className="lead text-white">
                ¡Bienvenido! Aquí puedes ver y editar tu información personal.
              </p>
            </div>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "150px" }}
                  fluid
                />
                <p className="text-muted mb-1">Full Stack Developer</p>
                <p className="text-muted mb-4">Bay Area, San Francisco, CA</p>
                <div className="d-flex justify-content-center mb-2">
                  <label
                    htmlFor="photo-upload"
                    className="btn btn-outline-primary ms-1"
                  >
                    Subir foto
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <form onSubmit={handleSubmit}>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Nombre Completo</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Email</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Telefono</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <input
                        type="text"
                        className="form-control"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Celular</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <input
                        type="text"
                        className="form-control"
                        name="celular"
                        value={formData.celular}
                        onChange={handleInputChange}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Direccion</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <input
                        type="text"
                        className="form-control"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBBtn type="submit" color="primary" className="mt-3">
                    Guardar Cambios
                  </MDBBtn>
                </form>
              </MDBCardBody>
            </MDBCard>

            {/* Aquí puedes agregar más secciones o componentes, como historial de pedidos, configuraciones, etc. */}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
