import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function App() {
  const [projectiles, setProjectiles] = useState([]);
  const [email, setEmail] = useState('');
  const [nomUtilisateur, setNomUtilisateur] = useState('');  // Nouveau state pour le nomUtilisateur
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Générer des projectiles aléatoires toutes les 1 à 3 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setProjectiles((prevProjectiles) => [
        ...prevProjectiles,
        {
          id: Date.now(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 10 + 5,
          opacity: Math.random() * 0.5 + 0.5,
          delay: Math.random() * 2,
          duration: Math.random() * 2 + 2,
        }
      ]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Fonction pour gérer la soumission du formulaire de connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    if ((!email && !nomUtilisateur) || !password) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/user/connexion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email || null,  // Si email est vide, on envoie null
          nomUtilisateur: nomUtilisateur || null,  // Si nomUtilisateur est vide, on envoie null
          password,
        }),
      });

      const data = await response.json();
      console.log('data : ', data);

      if (response.ok) {
         // Affiche soit le email soit le nomUtilisateur
        
        localStorage.setItem('tokenSession', data.token);
        
        navigate('/Interface')
      } else {
        setError(data.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      setError('Erreur lors de la connexion.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#D2691E] overflow-hidden">
      {/* Animation de fond (optionnel) */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
      />

      {/* Projectiles animés */}
      {projectiles.map((projectile) => (
        <motion.div
          key={projectile.id}
          className="absolute rounded-full bg-white"
          style={{
            width: projectile.size,
            height: projectile.size,
            left: projectile.x,
            top: projectile.y,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            x: projectile.x,
            y: projectile.y,
          }}
          animate={{
            opacity: projectile.opacity,
            scale: 1,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            opacity: { duration: 0.5, delay: projectile.delay, ease: 'easeOut' },
            scale: { duration: 0.5, delay: projectile.delay },
            x: { duration: projectile.duration, delay: projectile.delay },
            y: { duration: projectile.duration, delay: projectile.delay },
          }}
          exit={{
            opacity: 0,
            scale: 0,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
        />
      ))}

      {/* Formulaire de connexion */}
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <motion.div
          className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Connexion</h2>

          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                placeholder="Entrez votre email"
                aria-label="Email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="nomUtilisateur" className="block text-gray-700">Nom d'utilisateur</label>
              <input
                id="nomUtilisateur"
                type="text"
                value={nomUtilisateur}
                onChange={(e) => setNomUtilisateur(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                placeholder="Entrez votre nom d'utilisateur"
                aria-label="Nom d'utilisateur"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                placeholder="Entrez votre mot de passe"
                aria-label="Mot de passe"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Se connecter'}
            </button>
            <div className="w-full flex justify-between pt-4 text-sm text-gray-600">
              <p>Mot de passe <a href="#" className="hover:text-blue-600 ">oublié ?</a></p>
              <p>Création de <a href="/CreateAcount" className="hover:text-blue-600">compte</a></p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default App;





































































import React, { useState } from 'react';
import Header from './Header';  // Assure-toi que le chemin est correct.

interface Project {
  name: string;
  tokenSymbol: string;
  tokenBalance: number;
  creator: string;
  description: string;
}

const Interface: React.FC = () => {
  // Exemple de projets (remplacer par des données réelles)
  const [projects] = useState<Project[]>([
    {
      name: 'Project A',
      tokenSymbol: 'PA',
      tokenBalance: 1000,
      creator: 'Alice',
      description: 'Un projet révolutionnaire utilisant des tokens PA.',
    },
    {
      name: 'Project B',
      tokenSymbol: 'PB',
      tokenBalance: 2000,
      creator: 'Bob',
      description: 'Un autre projet innovant, utilisant des tokens PB.',
    },
    {
      name: 'Project C',
      tokenSymbol: 'PC',
      tokenBalance: 500,
      creator: 'Charlie',
      description: 'Un projet de petite envergure avec des tokens PC.',
    },
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [voteAmount, setVoteAmount] = useState<number>(0);
  const [account, setAccount] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);

  // Fonction pour connecter le portefeuille Metamask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setWalletConnected(true);
      } catch (err) {
        console.error("Erreur de connexion au portefeuille :", err);
      }
    } else {
      alert("Veuillez installer MetaMask !");
    }
  };

  // Fonction pour gérer le vote
  const handleVote = async () => {
    if (!selectedProject) {
      alert("Veuillez sélectionner un projet.");
      return;
    }
    
    if (voteAmount <= 0 || voteAmount > selectedProject.tokenBalance) {
      alert("Le nombre de tokens pour voter est invalide. Assurez-vous qu'il est supérieur à zéro et inférieur ou égal aux tokens disponibles.");
      return;
    }

    alert(`Vous avez voté pour le projet ${selectedProject.name} avec ${voteAmount} tokens.`);
    setVoteAmount(0); // Réinitialiser le montant du vote
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Intégration du Header */}
      <Header connectWallet={connectWallet} account={account} />

      <div className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Liste des Projets</h1>

        {/* Liste des projets sous forme de liste ordonnée */}
        <ol className="list-decimal pl-8">
          {projects.map((project) => (
            <li
              key={project.name}
              className="cursor-pointer hover:bg-gray-100 p-4 mb-4 bg-white rounded shadow-lg"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">{project.name}</span>
                <span className="text-sm text-gray-500">{project.tokenSymbol}</span>
              </div>
              <p className="text-sm text-gray-600">Tokens Disponibles: {project.tokenBalance}</p>
            </li>
          ))}
        </ol>

        {/* Détails du projet sélectionné */}
        {selectedProject && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
            <p className="mt-2 text-gray-700">Créateur: {selectedProject.creator}</p>
            <p className="mt-2 text-gray-700">Symbole du Token: {selectedProject.tokenSymbol}</p>
            <p className="mt-2 text-gray-700">Tokens disponibles: {selectedProject.tokenBalance}</p>
            <p className="mt-2 text-gray-700">Description: {selectedProject.description}</p>

            {/* Formulaire de vote */}
            <div className="mt-6">
              <label className="block text-lg font-semibold">Nombre de Tokens pour voter</label>
              <input
                type="number"
                value={voteAmount}
                onChange={(e) => setVoteAmount(Number(e.target.value))}
                className="border p-2 rounded mt-2 w-full"
                placeholder="Entrez le nombre de tokens"
                max={selectedProject.tokenBalance}
              />
              <button
                onClick={handleVote}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded w-full"
              >
                Voter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interface;
