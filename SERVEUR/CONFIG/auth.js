import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectionDb from './baseDeDonnee.js';  // Importer la connexion à la base de données
import dotenv from 'dotenv';  // Charger les variables d'environnement

dotenv.config();  // Charger les variables d'environnement à partir du fichier .env

const router = express.Router();

// Route d'inscription
const CreateCount = async (req, res) => {
  const { prenom, nom, nomUtilisateur, email, password } = req.body;

  if (!prenom || !nom || !nomUtilisateur || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà par email ou nomUtilisateur
    connectionDb.query('SELECT * FROM users WHERE email = ? OR nomUtilisateur = ?', [email, nomUtilisateur], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur de base de données' });
      if (results.length > 0) {
        return res.status(400).json({ message: 'Cet email ou nom d\'utilisateur est déjà utilisé.' });
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer l'utilisateur dans la base de données avec prénom, nom, nomUtilisateur et email
      connectionDb.query('INSERT INTO users (prenom, nom, nomUtilisateur, email, password) VALUES (?, ?, ?, ?, ?)', 
        [prenom, nom, nomUtilisateur, email, hashedPassword], (err, results) => {
          if (err) return res.status(500).json({ message: 'Erreur lors de l\'inscription.' });

          res.status(201).json({ message: 'Utilisateur inscrit avec succès.' });
        });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};




// Route de connexion
const Connexion = async (req, res) => {
  const { email, nomUtilisateur, password } = req.body;

  console.log("req.body : ", req.body);
  console.log(email, nomUtilisateur, password);

  if (!email && !nomUtilisateur || !password) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }

  // Vérifier si l'utilisateur existe par email ou nomUtilisateur
  const query = email ? 'SELECT * FROM users WHERE email = ?' : 'SELECT * FROM users WHERE nomUtilisateur = ?';
  const value = email || nomUtilisateur;

  connectionDb.query(query, [value], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur de base de données' });
    if (results.length === 0) {
      return res.status(400).json({ message: 'Utilisateur non trouvé.' });
    }

    const user = results[0];

    // Comparer le mot de passe avec le hachage dans la base de données
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    // Créer un token JWT
    const token = jwt.sign({ 
      id: user.id, 
      email: user.email, 
      prenom: user.prenom, 
      nom: user.nom, 
      nomUtilisateur: user.nomUtilisateur 
    }, '??@@8258', {
      expiresIn: '1h',  // Le token expire après 1 heure
    });
    console.log('token : ',token);

    res.status(200).json({ token });

  });
};

export { CreateCount, Connexion };  // Exporter les fonctions
