// src/config/env.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Validar que las variables requeridas estén presentes
if (!import.meta.env.VITE_API_URL && import.meta.env.PROD) {
  console.warn('⚠️ VITE_API_URL no está definida. Usando valor por defecto.');
}