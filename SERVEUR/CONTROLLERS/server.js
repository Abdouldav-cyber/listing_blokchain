import express from 'express';
import cors from 'cors';
import { CreateCount, Connexion } from '../CONFIG/auth.js';  // Importer les fonctions du fichier auth.js

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Pour analyser le corps des requêtes JSON

// Routes
app.post('/user/register', CreateCount);  // Route d'inscription
app.post('/user/connexion', Connexion);  // Route de connexion

// Démarrer le serveur
const port = 5000;
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
