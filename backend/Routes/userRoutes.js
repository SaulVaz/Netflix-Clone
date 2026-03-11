const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

// CONFIGURACIÓN Y VALIDACIONES
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(' JWT_SECRET no está definido en las variables de entorno');
}

// Validadores
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// MIDDLEWARE DE AUTENTICACIÓN
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado, token requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// RUTAS PÚBLICAS

// POST - Registro de usuario
router.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Crear nuevo usuario
    const newUser = new User({ name, email, password, favorites: [] });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'Usuario creado correctamente',
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

// POST - Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Generar token JWT (expira en 7 días)
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        favorites: user.favorites
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error en login' });
  }
});

// RUTAS PROTEGIDAS (requieren autenticación)

// POST - Logout
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logout exitoso' });
});

// GET - Perfil del usuario autenticado
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error al obtener perfil:', err);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
});

// GET - Todos los usuarios
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// PUT - Actualizar usuario
router.put('/users/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'No autorizado para modificar este usuario' });
    }

    const { name, email, favorites } = req.body;

    // Validar email si se está actualizando
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, favorites },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

// DELETE - Eliminar usuario
router.delete('/users/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'No autorizado para eliminar este usuario' });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

// RUTAS DE FAVORITOS

// GET - Obtener favoritos del usuario
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error('Error al obtener favoritos:', err);
    res.status(500).json({ message: 'Error al obtener favoritos' });
  }
});

// POST - Agregar a favoritos
router.post('/favorites/:movieId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.favorites.includes(req.params.movieId)) {
      return res.status(400).json({ message: 'El contenido ya está en favoritos' });
    }

    user.favorites.push(req.params.movieId);
    await user.save();

    res.json({ message: 'Agregado a favoritos', favorites: user.favorites });
  } catch (err) {
    console.error('Error al agregar a favoritos:', err);
    res.status(500).json({ message: 'Error al agregar a favoritos' });
  }
});

// DELETE - Eliminar de favoritos
router.delete('/favorites/:movieId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.favorites = user.favorites.filter(id => id !== req.params.movieId);
    await user.save();

    res.json({ message: 'Eliminado de favoritos', favorites: user.favorites });
  } catch (err) {
    console.error('Error al eliminar de favoritos:', err);
    res.status(500).json({ message: 'Error al eliminar de favoritos' });
  }
});

module.exports = router;