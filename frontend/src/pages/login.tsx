import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/env';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  // Estados para el formulario de registro
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.message || 'Error al iniciar sesión');
        return;
      }

      const data = await res.json();
      login(data.token, data.user);
      setMessage(` Bienvenido ${data.user.name}`);
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      console.error('Error de conexión:', err);
      setMessage(' Error al conectar con el servidor. Verifica que el backend esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterMessage('');

    // Validaciones
    if (!registerName.trim()) {
      setRegisterMessage(' El nombre es requerido');
      return;
    }

    if (!registerEmail.trim()) {
      setRegisterMessage(' El email es requerido');
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterMessage(' La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (registerPassword !== confirmPassword) {
      setRegisterMessage(' Las contraseñas no coinciden');
      return;
    }

    setIsRegistering(true);

    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRegisterMessage(` ${data.message || 'Error al crear la cuenta'}`);
        return;
      }

      // Registro exitoso
      setRegisterMessage(' ¡Cuenta creada exitosamente! Redirigiendo al login...');
      
      // Limpiar formulario
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
      
      // Cerrar modal y mostrar mensaje en login después de 2 segundos
      setTimeout(() => {
        setShowRegister(false);
        setRegisterMessage('');
        setMessage('✅ Cuenta creada. Ahora puedes iniciar sesión');
      }, 2000);
      
    } catch (err) {
      console.error('Error de conexión:', err);
      setRegisterMessage(' Error al conectar con el servidor. Verifica que el backend esté corriendo.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black/50" aria-hidden="true"></div>
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-red-900/10 to-transparent"></div>
      </div>
      
      {/* Netflix Logo */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-red-600 font-bold text-3xl">NETFLIX</h1>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-black/75 backdrop-blur-sm rounded-lg p-8 shadow-2xl border border-gray-800">
          <h2 className="text-white text-3xl font-bold mb-8 text-center">
            Iniciar sesión
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="email" className="sr-only">Email o número de teléfono</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Email o número de teléfono"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Contraseña"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar sesión'
              )}
            </button>

            {message && (
              <div 
                className={`p-3 rounded-md text-center font-medium ${
                  message.includes('✅') 
                    ? 'bg-green-900/30 text-green-400 border border-green-800' 
                    : 'bg-red-900/30 text-red-400 border border-red-800'
                }`}
                role="alert"
                aria-live="polite"
              >
                {message}
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mr-2 rounded bg-gray-800 border-gray-700"
                  aria-label="Recuérdame"
                />
                <span>Recuérdame</span>
              </label>
              <button 
                type="button"
                onClick={() => setShowHelp(true)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ¿Necesitas ayuda?
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-400">
            <p className="text-sm">
              ¿Primera vez en Netflix?{' '}
              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="text-white hover:underline font-semibold"
              >
                Suscríbete ahora
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Ayuda */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold">¿Necesitas ayuda?</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Credenciales de prueba:</h4>
                <div className="bg-gray-800 p-3 rounded text-sm">
                  <p className="text-gray-300">Email: <span className="text-white">test@netflix.com</span></p>
                  <p className="text-gray-300">Contraseña: <span className="text-white">123456</span></p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-white font-semibold mb-2">Problemas comunes:</h4>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Verifica que el backend esté corriendo (puerto 3001)</li>
                  <li>• Asegúrate de usar un email válido</li>
                  <li>• La contraseña debe tener mínimo 6 caracteres</li>
                </ul>
              </div>

              <button
                onClick={() => setShowHelp(false)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Registro */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 border border-gray-700 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold">Crear cuenta nueva</h3>
              <button
                onClick={() => {
                  setShowRegister(false);
                  setRegisterMessage('');
                  setRegisterName('');
                  setRegisterEmail('');
                  setRegisterPassword('');
                  setConfirmPassword('');
                }}
                className="text-gray-400 hover:text-white"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre completo
                </label>
                <input
                  id="register-name"
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                  placeholder="Tu nombre"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="tu@email.com"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-300 mb-1">
                  Contraseña
                </label>
                <input
                  id="register-password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirmar contraseña
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              {registerMessage && (
                <div 
                  className={`p-3 rounded-md text-sm font-medium ${
                    registerMessage.includes('✅') 
                      ? 'bg-green-900/30 text-green-400 border border-green-800' 
                      : 'bg-red-900/30 text-red-400 border border-red-800'
                  }`}
                  role="alert"
                  aria-live="polite"
                >
                  {registerMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition-colors"
              >
                {isRegistering ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creando cuenta...</span>
                  </div>
                ) : (
                  'Crear cuenta'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                Al crear una cuenta, aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}