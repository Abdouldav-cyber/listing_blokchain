import mysql from 'mysql2';  // Importer le module mysql2
import dotenv from 'dotenv';  // Importer dotenv



// Création de la connexion à la base de données en utilisant les variables d'environnement
const connectionDb = mysql.createConnection({
    host: 'localhost',     // Utilisez des guillemets pour les chaînes de caractères
    user: 'root',          // Utilisez également des guillemets pour le nom d'utilisateur
    password: '', // Utilisez des guillemets pour le mot de passedavou64598258
    database: 'base_listing'  // Utilisez des guillemets pour le nom de la base de données
  });

  



// Vérification de la connexion
connectionDb.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    process.exit(1); // Arrêter l'application en cas d'erreur
  }
  console.log('Base de données MySQL connectée');
});

// Exporter la connexion pour l'utiliser dans d'autres fichiers
export default connectionDb;
