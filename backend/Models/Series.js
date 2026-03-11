const mongoose = require('mongoose');

const SeriesSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  trailerUrl: String,
  ageRating: String,
  seasons: Number,        // Número de temporadas
  episodes: Number,       // Total de episodios
  isTrending: Boolean
});

const Series = mongoose.model('series', SeriesSchema);

module.exports = Series;