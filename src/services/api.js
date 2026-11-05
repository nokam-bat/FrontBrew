// On importe la bibliothèque axios pour l'utiliser
import axios from 'axios';

// Création d'un objet api qui retient des configurations par défaut.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // import.meta.env indique qu'on utilise Vite
  headers: { // configure les en-têtes HTTP envoyé avec chaque requête
    'Content-Type': 'application/json', // indique au serveur que les données envoyées par l'applicaition sont formatées en JSON
  },
});

export default api;