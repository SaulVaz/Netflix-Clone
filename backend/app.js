require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dbConnect = require('./config');
const movieRoutes = require('./Routes/movieRoutes');
const userRoutes = require('./Routes/userRoutes');
const seriesRoutes = require('./Routes/seriesRoutes');
const chatRoutes = require('./Routes/chatRoutes');

const app = express();

// ═══════════════════════════════════════════════════════════
// MIDDLEWARES DE SEGURIDAD
// ═══════════════════════════════════════════════════════════

// Helmet: protege contra vulnerabilidades comunes
app.use(helmet());

// CORS configurado correctamente
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Parse JSON con límite de tamaño
app.use(express.json({ limit: '10mb' }));

// ═══════════════════════════════════════════════════════════
// RUTAS
// ═══════════════════════════════════════════════════════════

app.use('/api', movieRoutes);
app.use('/api', userRoutes);
app.use('/api', seriesRoutes);
app.use('/api', chatRoutes);

// Ruta de healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// ═══════════════════════════════════════════════════════════
// MANEJO DE ERRORES GLOBAL
// ═══════════════════════════════════════════════════════════

app.use((err, req, res, next) => {
  console.error(' Error:', err.stack);
  
  // No exponer detalles del error en producción
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    ...(isDevelopment && { stack: err.stack })
  });
});

// ═══════════════════════════════════════════════════════════
// INICIO DEL SERVIDOR
// ═══════════════════════════════════════════════════════════

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Conectar a MongoDB primero
    await dbConnect();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(` Servidor corriendo en puerto ${PORT}`);
      console.log(` Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error(' Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log(' SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});