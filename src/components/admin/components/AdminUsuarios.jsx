import React, { useState, useEffect } from "react";

const AdminCRUDUsuarios = () => {
  // Estados para manejar los usuarios y el formulario
  const [usuarios, setUsuarios] = useState([]);
  const [filtroCorreo, setFiltroCorreo] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    password: "",
    direccion: ""
  });
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  // Cargar usuarios al iniciar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Función para cargar todos los usuarios
  const cargarUsuarios = () => {
    fetch("http://localhost:5000/api/admin/crud/usuarios")
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
      })
      .catch((error) => {
        console.error("Error al cargar usuarios:", error);
        setMensajeError("Error al cargar los usuarios");
      });
  };

  // Función para filtrar usuarios por correo
  const filtrarUsuarios = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/admin/crud/usuarios/buscar?email=${filtroCorreo}`)
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
      })
      .catch((error) => {
        console.error("Error al filtrar usuarios:", error);
        setMensajeError("Error al buscar usuarios");
      });
  };

  // Función para resetear filtros
  const resetearFiltros = () => {
    setFiltroCorreo("");
    cargarUsuarios();
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función para añadir un nuevo usuario
  const agregarUsuario = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.email || !formData.password) {
      setMensajeError("Por favor complete los campos obligatorios");
      return;
    }

    fetch("http://localhost:5000/api/admin/crud/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMensajeError(data.error);
        } else {
          setMensajeExito("Usuario creado correctamente");
          setFormData({
            nombre: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            email: "",
            password: "",
            direccion: ""
          });
          cargarUsuarios();
        }
      })
      .catch((error) => {
        console.error("Error al crear usuario:", error);
        setMensajeError("Error al crear el usuario");
      });
  };

  // Función para preparar la edición de un usuario
  const prepararEdicion = (usuario) => {
    setUsuarioEditando(usuario._id);
    setModoEdicion(true);
    setFormData({
      nombre: usuario.nombre,
      apellidoPaterno: usuario.apellidoPaterno,
      apellidoMaterno: usuario.apellidoMaterno,
      email: usuario.email,
      password: "", // No incluimos la contraseña por seguridad
      direccion: usuario.direccion
    });
  };

  // Función para actualizar un usuario
  const actualizarUsuario = (e) => {
    e.preventDefault();
    
    const datosActualizados = {...formData};
    // Si no se ingresa una nueva contraseña, la eliminamos del objeto
    if (!datosActualizados.password) {
      delete datosActualizados.password;
    }

    fetch(`http://localhost:5000/api/admin/crud/usuarios/${usuarioEditando}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosActualizados),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMensajeError(data.error);
        } else {
          setMensajeExito("Usuario actualizado correctamente");
          setModoEdicion(false);
          setUsuarioEditando(null);
          setFormData({
            nombre: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            email: "",
            password: "",
            direccion: ""
          });
          cargarUsuarios();
        }
      })
      .catch((error) => {
        console.error("Error al actualizar usuario:", error);
        setMensajeError("Error al actualizar el usuario");
      });
  };

  // Función para eliminar un usuario
  const eliminarUsuario = (id) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      fetch(`http://localhost:5000/api/admin/crud/usuarios/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setMensajeError(data.error);
          } else {
            setMensajeExito("Usuario eliminado correctamente");
            cargarUsuarios();
          }
        })
        .catch((error) => {
          console.error("Error al eliminar usuario:", error);
          setMensajeError("Error al eliminar el usuario");
        });
    }
  };

  // Función para cancelar la edición
  const cancelarEdicion = () => {
    setModoEdicion(false);
    setUsuarioEditando(null);
    setFormData({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      password: "",
      direccion: ""
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Administración de Usuarios</h1>
      </div>

      {/* Mensajes de éxito o error */}
      {mensajeExito && (
        <div style={styles.mensajeExito}>
          <p>{mensajeExito}</p>
          <button onClick={() => setMensajeExito("")} style={styles.btnCerrar}>
            X
          </button>
        </div>
      )}

      {mensajeError && (
        <div style={styles.mensajeError}>
          <p>{mensajeError}</p>
          <button onClick={() => setMensajeError("")} style={styles.btnCerrar}>
            X
          </button>
        </div>
      )}

      <div style={styles.content}>
        {/* Formulario de búsqueda */}
        <div style={styles.card}>
          <h2>🔍 Buscar Usuario</h2>
          <form onSubmit={filtrarUsuarios} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="filtroCorreo">Correo electrónico:</label>
              <input
                type="email"
                id="filtroCorreo"
                value={filtroCorreo}
                onChange={(e) => setFiltroCorreo(e.target.value)}
                style={styles.input}
                placeholder="Buscar por correo electrónico"
              />
            </div>
            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.btnPrimary}>
                Buscar
              </button>
              <button
                type="button"
                onClick={resetearFiltros}
                style={styles.btnSecondary}
              >
                Mostrar Todos
              </button>
            </div>
          </form>
        </div>

        {/* Formulario para agregar/editar usuario */}
        <div style={styles.card}>
          <h2>{modoEdicion ? "✏️ Editar Usuario" : "➕ Agregar Nuevo Usuario"}</h2>
          <form
            onSubmit={modoEdicion ? actualizarUsuario : agregarUsuario}
            style={styles.form}
          >
            <div style={styles.formGroup}>
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Nombre"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="apellidoPaterno">Apellido Paterno:</label>
              <input
                type="text"
                id="apellidoPaterno"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Apellido Paterno"
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="apellidoMaterno">Apellido Materno:</label>
              <input
                type="text"
                id="apellidoMaterno"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Apellido Materno"
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email">Correo Electrónico:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Correo electrónico"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password">
                {modoEdicion ? "Nueva Contraseña (dejar en blanco para mantener la actual):" : "Contraseña:"}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                style={styles.input}
                placeholder={modoEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
                required={!modoEdicion}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="direccion">Dirección:</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Dirección"
              />
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.btnPrimary}>
                {modoEdicion ? "Actualizar" : "Agregar"}
              </button>
              {modoEdicion && (
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  style={styles.btnSecondary}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla de usuarios */}
        <div style={styles.card}>
          <h2>📋 Lista de Usuarios</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellidos</th>
                  <th>Correo</th>
                  <th>Dirección</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <tr key={usuario._id}>
                      <td>{usuario.nombre}</td>
                      <td>
                        {usuario.apellidoPaterno} {usuario.apellidoMaterno}
                      </td>
                      <td>{usuario.email}</td>
                      <td>{usuario.direccion}</td>
                      <td>
                        {new Date(usuario.fechaRegistro).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={styles.buttonGroup}>
                          <button
                            onClick={() => prepararEdicion(usuario)}
                            style={styles.btnEdit}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => eliminarUsuario(usuario._id)}
                            style={styles.btnDelete}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={styles.noData}>
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Estilos en línea con la paleta de colores del proyecto
const styles = {
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    marginBottom: "20px",
    borderBottom: "2px solid #00515F",
    paddingBottom: "10px",
  },
  title: {
    color: "#00515F",
    fontSize: "28px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  btnPrimary: {
    padding: "10px 15px",
    backgroundColor: "#00515F",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "10px 15px",
    backgroundColor: "#FFFFFF",
    color: "#00515F",
    border: "1px solid #00515F",
    borderRadius: "5px",
    cursor: "pointer",
  },
  btnEdit: {
    padding: "5px 10px",
    backgroundColor: "#FFD700",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  btnDelete: {
    padding: "5px 10px",
    backgroundColor: "#FF6B6B",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  btnCerrar: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  mensajeExito: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "10px 15px",
    borderRadius: "5px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mensajeError: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "10px 15px",
    borderRadius: "5px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#6c757d",
  },
};

export default AdminCRUDUsuarios;