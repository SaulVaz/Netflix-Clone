const express = require('express');
const router = express.Router();
const Movie = require('../Models/Movie');

// GET /api/movies - Obtener todas las películas
router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error('Error al obtener películas:', err);
    res.status(500).json({ message: 'Error al obtener las películas' });
  }
});

// GET /api/movies/:id - Obtener una película por ID
router.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }
    
    res.json(movie);
  } catch (err) {
    console.error('Error al obtener película:', err);
    
    // Manejo específico de errores de MongoDB
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID de película inválido' });
    }
    
    res.status(500).json({ message: 'Error al obtener la película' });
  }
});

module.exports = router;