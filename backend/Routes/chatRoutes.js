const express = require('express');
const router = express.Router();

// Chatbot simulado pero con respuestas muy inteligentes
const getSmartResponse = (message) => {
  const msg = message.toLowerCase().trim();
  
  // === RECOMENDACIONES ===
  if (msg.includes('recomiend') || msg.includes('suger') || msg.includes('ver') || msg.includes('película') || msg.includes('pelicula') || msg.includes('serie')) {
    // Acción
    if (msg.includes('acción') || msg.includes('accion')) {
      const actionMovies = [
        'John Wick (acción pura con Keanu Reeves) 🔫',
        'Mad Max: Fury Road (acción post-apocalíptica) 🚗',
        'The Dark Knight (Batman de Christopher Nolan) 🦇',
        'Extraction (con Chris Hemsworth) 💥',
        'The Raid (artes marciales indonesias) 🥋'
      ];
      const random = actionMovies[Math.floor(Math.random() * actionMovies.length)];
      return `Te recomiendo ${random} ¡Es increíble!`;
    }
    
    // Comedia
    if (msg.includes('comedia') || msg.includes('reir') || msg.includes('reír') || msg.includes('graciosa')) {
      const comedies = [
        'Superbad (comedia juvenil clásica) 😂',
        'The Grand Budapest Hotel (comedia visual de Wes Anderson) 🏨',
        'Step Brothers (Will Ferrell y John C. Reilly) 🤣',
        'Knives Out (misterio con humor) 🔪',
        'Game Night (comedia de suspenso) 🎲'
      ];
      const random = comedies[Math.floor(Math.random() * comedies.length)];
      return `Para reírte te sugiero ${random} ¡No te la pierdas!`;
    }
    
    // Drama
    if (msg.includes('drama') || msg.includes('llorar') || msg.includes('triste')) {
      const dramas = [
        'The Shawshank Redemption (drama carcelario) 🔒',
        'Forrest Gump (Tom Hanks en su mejor papel) 🏃',
        'The Green Mile (drama emotivo) 😢',
        'A Beautiful Mind (sobre John Nash) 🧠',
        'Marriage Story (drama contemporáneo) 💔'
      ];
      const random = dramas[Math.floor(Math.random() * dramas.length)];
      return `Te recomiendo ${random} Prepara los pañuelos.`;
    }
    
    // Terror
    if (msg.includes('terror') || msg.includes('miedo') || msg.includes('horror') || msg.includes('susto')) {
      const horror = [
        'The Conjuring (terror paranormal) 👻',
        'A Quiet Place (terror sin sonido) 🤫',
        'Hereditary (terror psicológico) 😱',
        'Get Out (terror social) 😨',
        'The Witch (terror atmosférico) 🧙'
      ];
      const random = horror[Math.floor(Math.random() * horror.length)];
      return `Si quieres asustarte, mira ${random} ¡Que duermas bien!`;
    }
    
    // Romántica
    if (msg.includes('roman') || msg.includes('amor')) {
      const romance = [
        'The Notebook (romance clásico) 💕',
        'La La Land (musical romántico) 🎵',
        'Pride and Prejudice (Jane Austen) 📚',
        'To All the Boys I\'ve Loved Before (romance adolescente) 💌',
        'The Fault in Our Stars (romance juvenil) ⭐'
      ];
      const random = romance[Math.floor(Math.random() * romance.length)];
      return `Para el romance te recomiendo ${random}`;
    }
    
    // Series específicas
    if (msg.includes('serie')) {
      const series = [
        'Breaking Bad (drama sobre un profesor de química) ⚗️',
        'Stranger Things (ciencia ficción retro) 🔦',
        'The Crown (drama histórico sobre la realeza) 👑',
        'The Witcher (fantasía épica) ⚔️',
        'Money Heist (La Casa de Papel - thriller español) 💰',
        'Black Mirror (antología de ciencia ficción) 📺',
        'Squid Game (thriller coreano) 🎮',
        'The Office (comedia mockumentary) 📋'
      ];
      const random = series[Math.floor(Math.random() * series.length)];
      return `Te sugiero ${random} ¡Es adictiva!`;
    }
    
    // Genérica
    return 'Tengo muchas opciones para ti. ¿Prefieres películas de acción, comedia, drama, terror, romance o series? 🎬🍿';
  }
  
  // === PROBLEMAS TÉCNICOS ===
  if (msg.includes('error') || msg.includes('problema') || msg.includes('no funciona') || msg.includes('bug') || msg.includes('falla')) {
    if (msg.includes('video') || msg.includes('reproduce') || msg.includes('play') || msg.includes('carga')) {
      return 'Para problemas de reproducción: 1) Verifica tu conexión a internet 📶, 2) Cierra y abre la app 🔄, 3) Borra la caché del navegador. Si persiste, prueba en otro dispositivo.';
    }
    if (msg.includes('cuenta') || msg.includes('login') || msg.includes('contraseña') || msg.includes('sesión') || msg.includes('sesion')) {
      return 'Si tienes problemas con tu cuenta, puedes restablecer tu contraseña desde "¿Olvidaste tu contraseña?" en la página de inicio de sesión. 🔑';
    }
    return 'Para resolver problemas técnicos: 1) Cierra sesión y vuelve a entrar 🔄, 2) Limpia la caché del navegador (Ctrl+Shift+Del) 🧹, 3) Verifica tu conexión a internet 📡. Si continúa, contacta a soporte.';
  }
  
  // === PLANES Y PRECIOS ===
  if (msg.includes('plan') || msg.includes('precio') || msg.includes('suscr') || msg.includes('costo') || msg.includes('pagar') || msg.includes('cuanto')) {
    return 'Netflix ofrece diferentes planes: Básico 📺, Estándar 💻, y Premium ⭐. Los precios varían según el país. Visita "Cuenta" en tu perfil para ver los planes disponibles en tu región.';
  }
  
  // === DESCARGAS ===
  if (msg.includes('descarg') || msg.includes('bajar') || msg.includes('offline')) {
    return 'Para descargar contenido: 1) Abre la app móvil 📱, 2) Busca la película/serie que quieras, 3) Toca el ícono de descarga (flecha hacia abajo ⬇️). Solo funciona en la app móvil.';
  }
  
  // === PERFILES ===
  if (msg.includes('perfil') || msg.includes('usuario') || msg.includes('cuenta')) {
    return 'Para gestionar perfiles: ve a tu avatar en la esquina superior derecha → Gestionar perfiles 👤. Puedes crear hasta 5 perfiles por cuenta.';
  }
  
  // === CANCELACIÓN ===
  if (msg.includes('cancel')) {
    return 'Para cancelar tu suscripción: ve a Cuenta → Cancelar suscripción 🚫. Podrás seguir viendo hasta el final del período pagado.';
  }
  
  // === BÚSQUEDA ===
  if (msg.includes('buscar') || msg.includes('encontrar') || msg.includes('dónde') || msg.includes('donde')) {
    return 'Usa el ícono de búsqueda 🔍 en la parte superior de la pantalla. Puedes buscar por título, actor, director o género. ¡Prueba escribir lo que quieras ver!';
  }
  
  // === CALIDAD ===
  if (msg.includes('calidad') || msg.includes('hd') || msg.includes('4k') || msg.includes('resolución') || msg.includes('resolucion')) {
    return 'La calidad de video depende de tu plan: Básico (SD 📺), Estándar (HD 1080p 💻), Premium (4K Ultra HD ⭐). También depende de tu velocidad de internet.';
  }
  
  // === DISPOSITIVOS ===
  if (msg.includes('dispositivo') || msg.includes('tv') || msg.includes('celular') || msg.includes('tablet') || msg.includes('computadora')) {
    return 'Netflix funciona en Smart TVs 📺, celulares 📱, tablets, computadoras 💻 y consolas 🎮. Descarga la app desde la tienda de tu dispositivo o usa el navegador web.';
  }
  
  // === IDIOMA Y SUBTÍTULOS ===
  if (msg.includes('idioma') || msg.includes('subtítulo') || msg.includes('subtitulo') || msg.includes('audio')) {
    return 'Para cambiar idioma o subtítulos: mientras reproduces contenido, toca el ícono de diálogo 💬 en la esquina. Puedes elegir diferentes audios e idiomas de subtítulos disponibles.';
  }
  
  // === CONTINUAR VIENDO ===
  if (msg.includes('continuar') || msg.includes('historial') || msg.includes('vi')) {
    return 'Para continuar viendo: ve a "Inicio" y busca la sección "Continuar viendo" 📺. Ahí encontrarás todo el contenido que dejaste a la mitad.';
  }
  
  // === SALUDOS ===
  if (msg.includes('hola') || msg.includes('buenos') || msg.includes('buenas') || msg.includes('hey') || msg.includes('hi')) {
    return '¡Hola! 👋 Soy tu asistente de Netflix. Puedo ayudarte con recomendaciones de películas/series 🎬, problemas técnicos 🔧, información sobre planes 💳, o cualquier duda que tengas. ¿Qué necesitas?';
  }
  
  // === DESPEDIDA ===
  if (msg.includes('gracias') || msg.includes('adios') || msg.includes('adiós') || msg.includes('chao') || msg.includes('bye')) {
    return '¡De nada! 😊 Que disfrutes tu contenido en Netflix. ¡Hasta pronto y buen maratón! 🎬🍿';
  }
  
  // === ELOGIOS ===
  if (msg.includes('genial') || msg.includes('excelente') || msg.includes('perfecto') || msg.includes('bien') || msg.includes('bueno')) {
    return '¡Me alegra que te haya ayudado! 😊 ¿Hay algo más en lo que pueda asistirte?';
  }
  
  // === RESPUESTA POR DEFECTO ===
  const defaultResponses = [
    'Interesante pregunta. Puedo ayudarte con: 🎬 Recomendaciones de películas/series, 🔧 Problemas técnicos, 💳 Planes y precios, o 🔍 Búsqueda de contenido. ¿Qué te gustaría saber?',
    'No estoy seguro de entender completamente. ¿Quieres que te recomiende algo para ver 🎬, que te ayude con algún problema técnico 🔧, o que te explique sobre los planes de Netflix 💳?',
    'Hmm, déjame ayudarte mejor. ¿Estás buscando recomendaciones 🍿, ayuda técnica 🔧, o información sobre tu cuenta 👤?'
  ];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

// POST /api/chat - Chatbot simulado inteligente
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Validación
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Mensaje inválido',
        response: 'Por favor, envía un mensaje válido.' 
      });
    }

    // Simular delay realista (entre 600-1500ms)
    const delay = 600 + Math.random() * 900;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Generar respuesta inteligente
    const botResponse = getSmartResponse(message);

    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error en /api/chat:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      response: 'Lo siento, no pude procesar tu mensaje. Por favor, intenta de nuevo más tarde. 🔧' 
    });
  }
});

module.exports = router;