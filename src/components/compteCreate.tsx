import React, { useState } from 'react';
import { motion, Transition } from 'framer-motion';

const CreateAccount: React.FC = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Définir les paramètres de transition explicitement pour l'animation de l'opacité
  const transitionSettings: Transition = { duration: 0.5 };

  // Fonction de gestion du formulaire d'inscription
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prenom || !nom || !nomUtilisateur || !email || !password || !confirmPassword) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prenom,
          nom,
          nomUtilisateur,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Utilisateur créé avec succès !');
        // Optionnel : rediriger l'utilisateur après la création du compte
        // window.location.href = '/connexion';
      } else {
        setError(data.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      setError('Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#D2691E] overflow-hidden">
      {/* Animation de fond */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: 'easeInOut',
        }}
      />

      {/* Formulaire de création de compte */}
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <motion.div
          className="w-full p-6 bg-white rounded-lg shadow-lg"
          style={{ maxWidth: '800px', width: '100%' }} // Application du style en ligne ici
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transitionSettings}  // Applique la transition ici
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Créer un compte</h2>

          {error && <div className="text-red-500 text-center mb-2">{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="mb-2 flex items-center">
              <label htmlFor="prenom" className="block text-gray-700 w-1/4">Prénom</label>
              <input
                id="prenom"
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-3/4 p-3 mt-2 border border-gray-300 rounded-lg"
                placeholder="Entrez votre prénom"
              />
            </div>
            <div className="mb-2 flex items-center">
              <label htmlFor="nom" className="block text-gray-700 w-1/4">Nom</label>
              <input
                id="nom"
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-3/4 p-3 mt-2 border border-gray-300 rounded-lg"
                placeholder="Entrez votre nom"
              />
            </div>
            <div className="mb-2 flex items-center">
              <label htmlFor="nomUtilisateur" className="block text-gray-700 w-1/4">Nom d'utilisateur</label>
              <input
                id="nomUtilisateur"
                type="text"
                value={nomUtilisateur}
                onChange={(e) => setNomUtilisateur(e.target.value)}
                className="w-3/4 p-3 mt-2 border border-gray-300 rounded-lg"
                placeholder="Entrez votre nom d'utilisateur"
              />
            </div>
            <div className="mb-2 flex items-center">
              <label htmlFor="email" className="block text-gray-700 w-1/4">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-3/4 p-3 mt-2 border border-gray-300 rounded-lg"
                placeholder="Entrez votre email"
              />
            </div>
            <div className="mb-2 flex items-center">
              <label htmlFor="password" className="block text-gray-700 w-1/4">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-3/4 p-3 mt-2 border border-gray-300 rounded-lg"
                placeholder="Entrez votre mot de passe"
              />
            </div>
            <div className="mb-6 flex items-center">
              <label htmlFor="confirmPassword" className="block text-gray-700 w-1/4">Confirmer le mot de passe</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-3/4 p-3 mt-2 border border-gray-300 rounded-lg"
                placeholder="Confirmez votre mot de passe"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Créer un compte'}
            </button>
            <div className="w-full flex justify-between pt-4 text-sm text-gray-600">
              <p>Vous avez déjà un compte ? <a href="/" className="hover:text-blue-600">Se connecter</a></p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateAccount;
