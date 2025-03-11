const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  imagenUrl: { type: String, required: true }, // URL de la imagen
});

const Producto = mongoose.model("Producto", productoSchema);

module.exports = Producto;
