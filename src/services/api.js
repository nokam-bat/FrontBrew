import axios from 'axios';

// Création d'une instance Axios configurée avec l'URL de base de l'environnement
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;