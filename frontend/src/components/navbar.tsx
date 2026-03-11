import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  className?: string;
  onNavigate?: (section: string) => void;
  activeSection?: string;
  onSearchClick: () => void;
}

export default function Navbar({ className = "", onNavigate, activeSection = "home", onSearchClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú si se hace click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Obtener inicial del nombre del usuario
  const initial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent p-4 ${className}`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Logo + Links */}
        <div className="flex items-center space-x-8">
          <h1 className="text-red-600 font-bold text-2xl">NETFLIX</h1>
          <div className="hidden md:flex space-x-6 text-sm">
            <button
              onClick={() => onNavigate?.('home')}
              className={`hover:text-gray-300 transition-colors ${activeSection === 'home' ? 'text-white font-semibold' : ''}`}
            >
              Inicio
            </button>
            <button
              onClick={() => onNavigate?.('series')}
              className={`hover:text-gray-300 transition-colors ${activeSection === 'series' ? 'text-white font-semibold' : ''}`}
            >
              Series
            </button>
            <button
              onClick={() => onNavigate?.('movies')}
              className={`hover:text-gray-300 transition-colors ${activeSection === 'movies' ? 'text-white font-semibold' : ''}`}
            >
              Películas
            </button>
            <button
              onClick={() => onNavigate?.('new')}
              className={`hover:text-gray-300 transition-colors ${activeSection === 'new' ? 'text-white font-semibold' : ''}`}
            >
              Novedades
            </button>
            <button
              onClick={() => onNavigate?.('mylist')}
              className={`hover:text-gray-300 transition-colors ${activeSection === 'mylist' ? 'text-white font-semibold' : ''}`}
            >
              Mi lista
            </button>
          </div>
        </div>

        {/* Iconos derecha */}
        <div className="flex items-center space-x-4">
          {/* Búsqueda */}
          <button 
            onClick={onSearchClick}
            className="hover:text-gray-300 transition-colors"
            aria-label="Buscar"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Avatar + Menú desplegable */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-sm font-bold hover:bg-red-700 transition-colors"
              aria-label="Menú de usuario"
            >
              {initial}
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                
                {/* Info del usuario */}
                <div className="px-4 py-3 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center font-bold text-lg">
                      {initial}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                      <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Opciones */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigate?.('mylist');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    <span>Mi lista</span>
                  </button>
                </div>

                {/* Cerrar sesión */}
                <div className="border-t border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Cerrar sesión</span>
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}