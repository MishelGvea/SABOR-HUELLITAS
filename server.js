const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

// Importar rutas existentes
const productosRoutes = require("./routes/productos");
const nosotrosRoutes = require("./routes/nosotros");
const inicioRoutes = require("./routes/inicio");
const sliderRoutes = require("./routes/slider");
const tiendaRoutes = require("./routes/tienda");
const preguntasRoutes = require("./routes/preguntas");

// Importar nuevas rutas
const AuthRoutes = require("./routes/AuthRoutes");
const MascotaRoutes = require("./routes/MascotaRoutes");
const ConfiguracionRoutes = require("./routes/ConfiguracionRoutes");
const DispensadorRoutes = require("./routes/dispensadorRoutes"); // ✅ Importar la nueva ruta

//Importar Admin
const iotRoutes = require("./routes/iotRoutes");
const adminUsuariosRoutes = require("./routes/adminUsuariosRoutes");
const configuracionRoutes = require("./routes/ConfiguracionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const historialRoutes = require("./routes/historialRoutes");
const dispositivosRoutes = require("./routes/dispositivosRoutes");
const personalizacionRoutes = require("./routes/personalizacionRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
const adminCRUDUsuariosRoutes = require("./routes/adminCRUDUsuariosRoutes"); // ✅ Importar la nueva ruta CRUD

//rutas administrador
app.use("/api/iot", iotRoutes);
app.use("/api/admin/usuarios", adminUsuariosRoutes);
app.use("/api/configuracion", configuracionRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/historial", historialRoutes);
app.use("/api/dispositivos", dispositivosRoutes);
app.use("/api/personalizacion", personalizacionRoutes);
app.use('/uploads', express.static('public/uploads'));
app.use('/api/upload', uploadRoutes);
app.use("/api/admin/crud/usuarios", adminCRUDUsuariosRoutes);



// Usar rutas existentes
app.use("/api/tienda", tiendaRoutes);
app.use("/api/slider", sliderRoutes);
app.use("/api/inicio", inicioRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/nosotros", nosotrosRoutes);
app.use("/api/preguntas", preguntasRoutes);

// Usar nuevas rutas
app.use("/api/auth", AuthRoutes);
app.use("/api/mascotas", MascotaRoutes);
app.use("/api/configuracion", ConfiguracionRoutes);
app.use("/api/dispensador", DispensadorRoutes); // ✅ Integrar la ruta del dispensador

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error de conexión a MongoDB:", err));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
