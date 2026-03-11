const express = require('express');
const router = express.Router();
const Series = require('../Models/Series');

// GET /api/series - Obtener todas las series
router.get('/series', async (req, res) => {
  try {
    const series = await Series.find();
    res.json(series);
  } catch (err) {
    console.error('Error al obtener series:', err);
    res.status(500).json({ message: 'Error al obtener las series' });
  }
});

// GET /api/series/:id - Obtener una serie por ID
router.get('/series/:id', async (req, res) => {
  try {
    const serie = await Series.findById(req.params.id);
    
    if (!serie) {
      return res.status(404).json({ message: 'Serie no encontrada' });
    }
    
    res.json(serie);
  } catch (err) {
    console.error('Error al obtener serie:', err);
    
    // Manejo específico de errores de MongoDB
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID de serie inválido' });
    }
    
    res.status(500).json({ message: 'Error al obtener la serie' });
  }
});

module.exports = router;