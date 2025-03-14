// routes/configuracionRoutes.js
const express = require("express");
const router = express.Router();
const Nosotros = require("../models/Nosotros");

// Obtener la configuración
router.get("/", async (req, res) => {
  try {
    // Buscar el documento existente
    let nosotros = await Nosotros.findOne();
    
    if (!nosotros) {
      return res.status(404).json({ mensaje: "Datos no encontrados" });
    }
    
    res.json(nosotros);
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({ mensaje: "Error al obtener la configuración" });
  }
});

// Actualizar la configuración
router.put("/", async (req, res) => {
  try {
    // Agregar logs para depuración
    console.log("Datos recibidos para actualizar:", req.body);
    
    // Obtener todos los datos del cuerpo de la petición
    const datos = req.body;
    
    // Buscar el documento existente por su ID
    const id = datos._id;
    delete datos._id; // Eliminar _id para evitar errores de MongoDB
    
    // Usar findOneAndUpdate en lugar de modificar y guardar
    const resultado = await Nosotros.findOneAndUpdate(
      {}, // Usar {} para obtener el primer documento (ya que solo hay uno)
      { $set: datos },
      { 
        new: true, // Devolver el documento actualizado
        runValidators: true // Ejecutar validadores de esquema
      }
    );
    
    if (!resultado) {
      return res.status(404).json({ mensaje: "No se encontró el documento para actualizar" });
    }
    
    console.log("Documento actualizado correctamente");
    res.json({ 
      mensaje: "Configuración actualizada correctamente",
      configuracion: resultado
    });
  } catch (error) {
    console.error("Error detallado al actualizar configuración:", error);
    res.status(500).json({ 
      mensaje: "Error al actualizar la configuración", 
      error: error.message 
    });
  }
});

module.exports = router;