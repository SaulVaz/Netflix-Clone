const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  trailerUrl: String,
  ageRating: String,
  duration: String,
  isTrending: Boolean
});

const Movie = mongoose.model('peliculas', MovieSchema);

module.exports = Movie;
