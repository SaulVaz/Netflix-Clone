# 🎬 Netflix Clone - MERN Stack

Clon de Netflix construido con MongoDB, Express, React y Node.js.

![Netflix Clone](https://img.shields.io/badge/Netflix-Clone-E50914?style=for-the-badge&logo=netflix&logoColor=white)
![MERN](https://img.shields.io/badge/MERN-Stack-00C58E?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## 🚀 Características

- ✅ **Autenticación completa:** Sistema de login y registro con JWT
- ✅ **Catálogo dinámico:** Películas y series con información detallada
- ✅ **Sistema de favoritos:** Guarda tu contenido favorito
- ✅ **Búsqueda en tiempo real:** Encuentra contenido al instante
- ✅ **Reproductor de trailers:** Visualiza trailers en modal
- ✅ **Chatbot inteligente:** Asistente para recomendaciones
- ✅ **Diseño responsive:** Funciona en móviles, tablets y escritorio
- ✅ **Seguridad:** Contraseñas hasheadas con bcrypt, JWT tokens
- ✅ **Hero carousel:** Rotación automática de contenido destacado

## 🛠️ Tecnologías

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **Bcrypt** - Hash de contraseñas
- **Helmet** - Seguridad HTTP
- **CORS** - Control de acceso

### Frontend
- **React 18** - Librería UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **React Router DOM** - Navegación
- **Vite** - Build tool
- **Context API** - Gestión de estado

## 📦 Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB (local o Atlas)
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/netflix-clone-mern.git
cd netflix-clone-mern
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en `backend/`:

```env
JWT_SECRET=tu-secret-super-seguro-de-al-menos-32-caracteres
MONGODB_URI=mongodb://localhost:27017/netflix-clone
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Inicia el servidor:

```bash
npm run dev
```

El backend estará corriendo en `http://localhost:3001`

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

Crea un archivo `.env` en `frontend/`:

```env
VITE_API_URL=http://localhost:3001
```

Inicia el cliente:

```bash
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

### 4. Poblar la base de datos (Opcional)

Puedes crear usuarios y contenido de prueba directamente en MongoDB o usar la API de registro.

**Usuario de prueba:**
- Email: `test@netflix.com`
- Contraseña: `123456`

## 🎯 Uso

1. Abre el navegador en `http://localhost:5173`
2. **Crear cuenta:**
   - Click en "Suscríbete ahora"
   - Llena el formulario de registro
   - Click en "Crear cuenta"
3. **O usa credenciales de prueba:**
   - Email: `test@netflix.com`
   - Contraseña: `123456`
4. ¡Explora el catálogo, agrega favoritos y disfruta!

## 📁 Estructura del Proyecto

```
netflix-clone/
├── backend/
│   ├── Models/
│   │   ├── User.js           # Modelo de usuario con bcrypt
│   │   ├── Movie.js          # Modelo de películas
│   │   └── Series.js         # Modelo de series
│   ├── Routes/
│   │   ├── userRoutes.js     # Login, registro, favoritos
│   │   ├── movieRoutes.js    # CRUD de películas
│   │   ├── seriesRoutes.js   # CRUD de series
│   │   └── chatRoutes.js     # Chatbot simulado
│   ├── middleware/
│   │   └── authMiddleware.js # Verificación JWT
│   ├── app.js                # Configuración Express
│   ├── .env                  # Variables de entorno (no incluido)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── navbar.tsx        # Barra de navegación
    │   │   └── ChatWidget.tsx    # Widget de chat
    │   ├── pages/
    │   │   ├── login.tsx         # Página de login/registro
    │   │   └── home.tsx          # Página principal
    │   ├── context/
    │   │   └── AuthContext.tsx   # Contexto de autenticación
    │   ├── config/
    │   │   └── env.ts            # Configuración de variables
    │   ├── App.tsx
    │   └── main.tsx
    ├── .env                      # Variables de entorno (no incluido)
    └── package.json
```

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con **bcrypt** (salt rounds: 10)
- ✅ Autenticación con **JWT** (tokens expiran en 7 días)
- ✅ Variables de entorno para datos sensibles
- ✅ CORS configurado para permitir solo frontend autorizado
- ✅ **Helmet.js** para headers de seguridad HTTP
- ✅ Validación de datos en backend y frontend
- ✅ Middleware de autenticación en rutas protegidas
- ✅ Sin contraseñas en respuestas de API

## 🌐 API Endpoints

### Públicos (sin autenticación)

```
POST   /api/users        # Registrar usuario
POST   /api/login        # Iniciar sesión
GET    /api/movies       # Listar películas
GET    /api/movies/:id   # Obtener película por ID
GET    /api/series       # Listar series
GET    /api/series/:id   # Obtener serie por ID
```

### Protegidos (requieren JWT)

```
GET    /api/favorites           # Obtener favoritos
POST   /api/favorites/:movieId  # Agregar a favoritos
DELETE /api/favorites/:movieId  # Eliminar de favoritos
PUT    /api/users/:id           # Actualizar usuario
DELETE /api/users/:id           # Eliminar usuario
```

## 🎨 Características de UI/UX

- **Hero Section:** Carousel automático de contenido destacado (rotación cada 10s)
- **Secciones:** Inicio, Series, Películas, Novedades, Mi Lista
- **Búsqueda:** Overlay con resultados en tiempo real
- **Modales:** Reproductor de trailers con iframe de YouTube
- **Estados de carga:** Spinners animados durante peticiones
- **Mensajes de error:** Feedback visual claro para el usuario
- **Accesibilidad:** ARIA labels, keyboard navigation, screen reader friendly
- **Responsive:** Mobile-first design con Tailwind CSS

## 🤖 Chatbot

El chatbot incluye:
- Recomendaciones por género (acción, comedia, drama, terror, romance)
- Ayuda técnica (descarga, reproducción, calidad)
- Información de planes y suscripciones
- Soporte de búsqueda y favoritos
- Respuestas con delay simulado (600-1500ms)

## 📝 Scripts Disponibles

### Backend
```bash
npm run dev      # Modo desarrollo con nodemon
npm start        # Modo producción
```

### Frontend
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
```

## 🚀 Deploy

### Backend (Heroku/Railway/Render)

1. Crea un cluster en MongoDB Atlas
2. Actualiza `MONGODB_URI` con la URI de Atlas
3. Agrega las variables de entorno en tu plataforma
4. Despliega el backend

### Frontend (Vercel/Netlify)

1. Conecta tu repositorio
2. Build command: `npm run build`
3. Output directory: `dist`
4. Agrega `VITE_API_URL` apuntando a tu backend desplegado

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [MIT License](LICENSE).

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@SaulVaz](https://github.com/tu-usuario)
- LinkedIn: [Saúl Vázquez](https://www.linkedin.com/in/saul-vazquez-del-rio/)

## 🙏 Agradecimientos

- Diseño inspirado en Netflix
- Icons de Heroicons
- Tailwind CSS por el framework de estilos
- React community por los recursos

---

⭐ **Si te gustó este proyecto, considera darle una estrella!**

Hecho con ❤️ usando MERN Stack
