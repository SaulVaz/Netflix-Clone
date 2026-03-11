const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    // Obtener URI desde variables de entorno
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('❌ MONGODB_URI no está definida en las variables de entorno');
    }

    mongoose.set('strictQuery', true);
    
    await mongoose.connect(MONGODB_URI, {
      // Opciones recomendadas de seguridad
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ Conectado a MongoDB exitosamente");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    process.exit(1); // Termina el proceso si no puede conectar
  }
};

module.exports = dbConnect;