/**
 * Conexión a MongoDB mediante Mongoose.
 * Exporta la función connectDB que establece la conexión usando MONGODB_URI.
 * Consumido por: server.js (al arrancar, salvo en entorno test).
 */
const mongoose = require("mongoose");

/** Establece la conexión con la base de datos; termina el proceso si falla. */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Salida forzada: sin BD la API no puede operar de forma consistente
    process.exit(1);
  }
};

module.exports = connectDB;
