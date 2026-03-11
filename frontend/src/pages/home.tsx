import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/env';

interface Movie {
  _id: string;
  title: string;
  description: string;
  image: string;
  trailerUrl: string;
  ageRating: string;
  duration: string;
  isTrending: boolean;
}

interface Series {
  _id: string;
  title: string;
  description: string;
  image: string;
  trailerUrl: string;
  ageRating: string;
  seasons: number;
  episodes: number;
  isTrending: boolean;
}

export default function Home() {
  const { token } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playTrailer, setPlayTrailer] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroItems, setHeroItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${API_URL}/api/movies`);
        if (!res.ok) throw new Error('Error al cargar películas');
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error('Error al cargar películas:', err);
        setError('No se pudieron cargar las películas');
      }
    };

    const fetchSeries = async () => {
      try {
        const res = await fetch(`${API_URL}/api/series`);
        if (!res.ok) throw new Error('Error al cargar series');
        const data = await res.json();
        setSeries(data);
      } catch (err) {
        console.error('Error al cargar series:', err);
        setError('No se pudieron cargar las series');
      }
    };

    const fetchFavorites = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/favorites`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Error al cargar favoritos');
        const data = await res.json();
        setFavorites(data.favorites || []);
      } catch (err) {
        console.error('Error al cargar favoritos:', err);
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      await Promise.all([fetchMovies(), fetchSeries(), fetchFavorites()]);
      setIsLoading(false);
    };

    loadData();
  }, [token]);

  useEffect(() => {
    const trendingMovies = movies
      .filter(m => m.isTrending)
      .map(m => ({ ...m, type: 'movie' as const }));
    
    const trendingSeries = series
      .filter(s => s.isTrending)
      .map(s => ({ ...s, type: 'series' as const }));
    
    const combined = [...trendingMovies, ...trendingSeries];
    setHeroItems(combined.slice(0, 5));
  }, [movies, series]);

  useEffect(() => {
    if (heroItems.length === 0) return;
    
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroItems.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [heroItems.length]);

  const toggleFavorite = async (movieId: string) => {
    if (!token) {
      alert('Debes iniciar sesión para agregar favoritos');
      return;
    }

    const isFavorite = favorites.includes(movieId);
    
    try {
      if (isFavorite) {
        const res = await fetch(`${API_URL}/api/favorites/${movieId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Error al eliminar favorito');
        setFavorites(favorites.filter(id => id !== movieId));
      } else {
        const res = await fetch(`${API_URL}/api/favorites/${movieId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Error al agregar favorito');
        setFavorites([...favorites, movieId]);
      }
    } catch (err) {
      console.error('Error al actualizar favoritos:', err);
      alert('No se pudo actualizar la lista de favoritos. Intenta de nuevo.');
    }
  };

  const searchContent = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    
    const matchedMovies = movies
      .filter(movie => movie.title.toLowerCase().includes(query))
      .map(m => ({ ...m, type: 'movie' as const }));
    
    const matchedSeries = series
      .filter(serie => serie.title.toLowerCase().includes(query))
      .map(s => ({ ...s, type: 'series' as const }));
    
    return [...matchedMovies, ...matchedSeries];
  };

  const searchResults = searchContent();

  const handleNavigation = (section: string) => {
    setActiveSection(section);
  };

  if (isLoading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <svg className="w-20 h-20 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Error al cargar el contenido</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const renderMoviesGrid = (moviesToShow: Movie[], title: string) => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      {moviesToShow.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No hay películas en esta sección</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {moviesToShow.map((movie) => (
            <div
              key={movie._id}
              className="group cursor-pointer relative"
              onClick={() => {
                setSelectedMovie(movie);
                setPlayTrailer(false);
              }}
            >
              <div className="relative">
                <img 
                  src={movie.image} 
                  alt={movie.title}
                  className="w-full h-72 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                {movie.isTrending && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    TRENDING
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(movie._id);
                }}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors z-10"
              >
                {favorites.includes(movie._id) ? (
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </button>
              <div className="mt-2">
                <h4 className="font-semibold text-sm truncate">{movie.title}</h4>
                <p className="text-xs text-gray-400">{movie.duration} · {movie.ageRating}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSeriesGrid = (seriesToShow: Series[], title: string) => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      {seriesToShow.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No hay series en esta sección</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {seriesToShow.map((serie) => (
            <div
              key={serie._id}
              className="group cursor-pointer relative"
            >
              <div className="relative" onClick={() => {
                setSelectedMovie(serie as any);
                setPlayTrailer(false);
              }}>
                <img 
                  src={serie.image} 
                  alt={serie.title}
                  className="w-full h-72 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                {serie.isTrending && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    TRENDING
                  </div>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(serie._id);
                }}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors z-10"
              >
                {favorites.includes(serie._id) ? (
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </button>

              <div className="mt-2">
                <h4 className="font-semibold text-sm truncate">{serie.title}</h4>
                <p className="text-xs text-gray-400">
                  {serie.seasons} {serie.seasons === 1 ? 'temporada' : 'temporadas'} · {serie.episodes} episodios
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFavoritesGrid = () => {
    const favoriteMovies = movies.filter(movie => favorites.includes(movie._id));
    const favoriteSeries = series.filter(serie => favorites.includes(serie._id));
    
    const allFavorites = [
      ...favoriteMovies.map(m => ({ ...m, type: 'movie' as const })),
      ...favoriteSeries.map(s => ({ ...s, type: 'series' as const }))
    ];

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Mi Lista</h2>
        {allFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-24 h-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-400 text-lg mb-2">No hay contenido en tu lista</p>
            <p className="text-gray-500 text-sm">Agrega películas o series haciendo clic en el ❤️</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {allFavorites.map((item: any) => (
              <div
                key={item._id}
                className="group cursor-pointer relative"
              >
                <div className="relative" onClick={() => {
                  setSelectedMovie(item);
                  setPlayTrailer(false);
                }}>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-72 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {item.isTrending && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      TRENDING
                    </div>
                  )}
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item._id);
                  }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors z-10"
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>

                <div className="mt-2">
                  <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-gray-400">
                    {item.type === 'movie' 
                      ? `${item.duration} · ${item.ageRating}` 
                      : `${item.seasons} ${item.seasons === 1 ? 'temporada' : 'temporadas'} · ${item.episodes} episodios`
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderNovedadesGrid = () => {
    const allContent = [
      ...movies.map(m => ({ ...m, type: 'movie' as const })),
      ...series.map(s => ({ ...s, type: 'series' as const }))
    ];

    const recentContent = [...allContent].reverse();

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Novedades</h2>
        <p className="text-gray-400 mb-8">Contenido agregado recientemente</p>
        
        {recentContent.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No hay contenido disponible</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {recentContent.map((item: any) => (
              <div
                key={item._id}
                className="group cursor-pointer relative"
              >
                <div className="relative" onClick={() => {
                  setSelectedMovie(item);
                  setPlayTrailer(false);
                }}>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-72 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                    NUEVO
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-gray-900/80 text-white px-2 py-1 rounded text-xs font-semibold">
                    {item.type === 'movie' ? 'PELÍCULA' : 'SERIE'}
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item._id);
                  }}
                  className="absolute top-12 right-4 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors z-10"
                >
                  {favorites.includes(item._id) ? (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>

                <div className="mt-2">
                  <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-gray-400">
                    {item.type === 'movie' 
                      ? `${item.duration} · ${item.ageRating}` 
                      : `${item.seasons} ${item.seasons === 1 ? 'temporada' : 'temporadas'} · ${item.episodes} episodios`
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar 
        onNavigate={handleNavigation} 
        activeSection={activeSection}
        onSearchClick={() => setSearchActive(true)}
      />

      {activeSection === 'home' && (
        <>
          {heroItems.length > 0 && heroItems[heroIndex] && (
            <div className="relative h-[80vh] flex items-center">
              <div 
                key={heroItems[heroIndex]._id}
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                style={{ 
                  backgroundImage: `url(${heroItems[heroIndex].image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>
              
              {heroItems.length > 1 && (
                <>
                  <button
                    onClick={() => setHeroIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length)}
                    className="absolute left-4 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-colors"
                    aria-label="Anterior"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => setHeroIndex((prev) => (prev + 1) % heroItems.length)}
                    className="absolute right-4 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-colors"
                    aria-label="Siguiente"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              <div className="relative z-10 max-w-7xl mx-auto px-4 flex items-center h-full">
                <div className="max-w-lg">
                  <div className="mb-3">
                    <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                      {heroItems[heroIndex].type === 'movie' ? 'PELÍCULA' : 'SERIE'}
                    </span>
                  </div>
                  
                  <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                    {heroItems[heroIndex].title}
                  </h2>
                  
                  <p className="text-lg mb-6 text-gray-200 leading-relaxed line-clamp-3">
                    {heroItems[heroIndex].description}
                  </p>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="bg-gray-800 px-2 py-1 rounded text-sm">
                      {heroItems[heroIndex].ageRating}
                    </span>
                    <span className="text-gray-300">
                      {heroItems[heroIndex].type === 'movie' 
                        ? heroItems[heroIndex].duration 
                        : `${heroItems[heroIndex].seasons} ${heroItems[heroIndex].seasons === 1 ? 'temporada' : 'temporadas'}`
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => {
                        setSelectedMovie(heroItems[heroIndex]);
                        setPlayTrailer(true);
                      }}
                      className="bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <span>Reproducir</span>
                    </button>
                    
                    <button 
                      onClick={() => toggleFavorite(heroItems[heroIndex]._id)}
                      className={`${
                        favorites.includes(heroItems[heroIndex]._id) 
                          ? 'bg-gray-700' 
                          : 'bg-gray-600/80'
                      } text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-600 transition-colors flex items-center space-x-2`}
                    >
                      {favorites.includes(heroItems[heroIndex]._id) ? (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>En mi lista</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Mi lista</span>
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => {
                        setSelectedMovie(heroItems[heroIndex]);
                        setPlayTrailer(false);
                      }}
                      className="bg-gray-600/40 text-white p-3 rounded-full font-semibold hover:bg-gray-600/60 transition-colors"
                      aria-label="Más información"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  {heroItems.length > 1 && (
                    <div className="flex space-x-2 mt-8">
                      {heroItems.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setHeroIndex(index)}
                          className={`h-1 rounded-full transition-all ${
                            index === heroIndex 
                              ? 'w-8 bg-red-600' 
                              : 'w-6 bg-gray-500 hover:bg-gray-400'
                          }`}
                          aria-label={`Ir a slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="relative z-10 -mt-32 pb-20">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 px-4 md:px-8">Tendencias ahora</h3>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 px-4 md:px-8 pb-4">
                  {[
                    ...movies.filter(m => m.isTrending).map(m => ({ ...m, type: 'movie' as const })),
                    ...series.filter(s => s.isTrending).map(s => ({ ...s, type: 'series' as const }))
                  ].map((item: any, index) => (
                    <div
                      key={item._id}
                      className="flex-shrink-0 w-48 group cursor-pointer relative"
                    >
                      <div className="relative" onClick={() => {
                        setSelectedMovie(item);
                        setPlayTrailer(false);
                      }}>
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-72 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg" />
                        
                        <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                          #{index + 1}
                        </div>
                        
                        <div className="absolute top-4 right-4 bg-gray-900/80 text-white px-2 py-1 rounded text-xs font-semibold">
                          {item.type === 'movie' ? 'PELÍCULA' : 'SERIE'}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item._id);
                        }}
                        className="absolute top-12 right-4 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors z-10"
                      >
                        {favorites.includes(item._id) ? (
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                      </button>
                      
                      <div className="mt-2">
                        <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                        <p className="text-xs text-gray-400">
                          {item.type === 'movie' 
                            ? item.duration 
                            : `${item.seasons} ${item.seasons === 1 ? 'temporada' : 'temporadas'}`
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 px-4 md:px-8">Todas las películas</h3>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 px-4 md:px-8 pb-4">
                  {movies.map((movie) => (
                    <div
                      key={movie._id}
                      className="flex-shrink-0 w-48 group cursor-pointer relative"
                    >
                      <div className="relative" onClick={() => {
                        setSelectedMovie(movie);
                        setPlayTrailer(false);
                      }}>
                        <img 
                          src={movie.image} 
                          alt={movie.title}
                          className="w-full h-72 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg">
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        {movie.isTrending && (
                          <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                            TRENDING
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(movie._id);
                        }}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors z-10"
                      >
                        {favorites.includes(movie._id) ? (
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                      </button>
                      
                      <div className="mt-2">
                        <h4 className="font-semibold text-sm truncate">{movie.title}</h4>
                        <p className="text-xs text-gray-400">{movie.duration} · {movie.ageRating}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 px-4 md:px-8">Todas las series</h3>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 px-4 md:px-8 pb-4">
                  {series.map((serie) => (
                    <div
                      key={serie._id}
                      className="flex-shrink-0 w-48 group cursor-pointer relative"
                    >
                      <div className="relative" onClick={() => {
                        setSelectedMovie(serie as any);
                        setPlayTrailer(false);
                      }}>
                        <img 
                          src={serie.image} 
                          alt={serie.title}
                          className="w-full h-72 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg">
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        {serie.isTrending && (
                          <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                            TRENDING
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(serie._id);
                        }}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors z-10"
                      >
                        {favorites.includes(serie._id) ? (
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                      </button>
                      
                      <div className="mt-2">
                        <h4 className="font-semibold text-sm truncate">{serie.title}</h4>
                        <p className="text-xs text-gray-400">
                          {serie.seasons} {serie.seasons === 1 ? 'temporada' : 'temporadas'} · {serie.episodes} episodios
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeSection === 'movies' && renderMoviesGrid(movies, 'Películas')}

      {activeSection === 'series' && (
        <div className="pt-20">
          {renderSeriesGrid(series, 'Series')}
        </div>
      )}

      {activeSection === 'new' && (
        <div className="pt-20">
          {renderNovedadesGrid()}
        </div>
      )}

      {activeSection === 'mylist' && (
        <div className="pt-20">
          {renderFavoritesGrid()}
        </div>
      )}

      {selectedMovie && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => setSelectedMovie(null)}
              aria-label="Cerrar"
            >
              ✕
            </button>

            {!playTrailer ? (
              <>
                <div className="relative">
                  <img
                    src={selectedMovie.image}
                    alt={selectedMovie.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-3xl font-bold mb-2">{selectedMovie.title}</h2>
                    <div className="flex items-center space-x-4 mb-4">
                      <button
                        onClick={() => setPlayTrailer(true)}
                        className="bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span>Reproducir</span>
                      </button>
                      <button 
                        onClick={() => toggleFavorite(selectedMovie._id)}
                        className={`${
                          favorites.includes(selectedMovie._id) 
                            ? 'bg-gray-700' 
                            : 'bg-gray-600/80'
                        } text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-600 transition-colors flex items-center space-x-2`}
                      >
                        {favorites.includes(selectedMovie._id) ? (
                          <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>En mi lista</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Mi lista</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-gray-700 px-3 py-1 rounded text-sm">{selectedMovie.ageRating}</span>
                    <span className="text-gray-300">{selectedMovie.duration}</span>
                    {selectedMovie.isTrending && (
                      <span className="bg-red-600 px-3 py-1 rounded text-sm font-bold">TRENDING</span>
                    )}
                  </div>
                  <p className="text-gray-300 leading-relaxed">{selectedMovie.description}</p>
                </div>
              </>
            ) : (
              <div className="relative" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src={selectedMovie.trailerUrl.replace("watch?v=", "embed/")}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={`Trailer de ${selectedMovie.title}`}
                  className="absolute top-0 left-0 w-full h-full"
                />
                <button
                  onClick={() => setPlayTrailer(false)}
                  className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-md hover:bg-black/70 transition-colors"
                >
                  ← Volver
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {searchActive && (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center space-x-4 mb-8">
              <button
                onClick={() => {
                  setSearchActive(false);
                  setSearchQuery('');
                }}
                className="text-white hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar películas o series..."
                  autoFocus
                  className="w-full bg-gray-900 text-white px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div>
              {searchQuery.trim() === '' ? (
                <div className="text-center py-20">
                  <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-gray-400 text-lg">Busca películas o series por título</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No se encontraron resultados para "{searchQuery}"</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {searchResults.length} {searchResults.length === 1 ? 'resultado' : 'resultados'} para "{searchQuery}"
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {searchResults.map((item: any) => (
                      <div
                        key={item._id}
                        className="group cursor-pointer relative"
                      >
                        <div className="relative" onClick={() => {
                          setSelectedMovie(item);
                          setPlayTrailer(false);
                          setSearchActive(false);
                        }}>
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-72 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg">
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          <div className="absolute top-4 right-4 bg-gray-900/80 text-white px-2 py-1 rounded text-xs font-semibold">
                            {item.type === 'movie' ? 'PELÍCULA' : 'SERIE'}
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item._id);
                          }}
                          className="absolute top-12 right-4 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors z-10"
                        >
                          {favorites.includes(item._id) ? (
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                        </button>

                        <div className="mt-2">
                          <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                          <p className="text-xs text-gray-400">
                            {item.type === 'movie' 
                              ? `${item.duration} · ${item.ageRating}` 
                              : `${item.seasons} ${item.seasons === 1 ? 'temporada' : 'temporadas'}`
                            }
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}