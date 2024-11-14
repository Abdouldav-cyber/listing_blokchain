import React, { useState } from 'react'; 
import Header from './Header';  // Assure-toi que ce fichier existe et est correctement implémenté.
import CreateProjectForm from './CreateProjectForm';  // Assure-toi que ce fichier existe et est correctement implémenté.


interface Project {
  name: string;
  tokenSymbol: string;
  tokenBalance: number;
  creator: string;
  description: string;
  tokenValue: { fcfa: number };
}

interface Vote {
  projectName: string;
  investor: string;
  amount: number;
}

const Interface: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);  // Liste des projets
  const [voteAmount, setVoteAmount] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('fcfa'); // Devise sélectionnée
  const [userRole, setUserRole] = useState<'entrepreneur' | 'investisseur'>('entrepreneur'); // Nouveau state pour gérer le rôle de l'utilisateur
  const [votes, setVotes] = useState<Vote[]>([]);  // Tableau des votes des investisseurs
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // State pour gérer l'alerte de création de projet

  // Connexion du portefeuille
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setWalletConnected(true);
      } catch (err) {
        console.error('Error connecting wallet:', err);
      }
    } else {
      alert('Veuillez installer MetaMask!');
    }
  };

  // Fonction pour changer le rôle de l'utilisateur
  const handleRoleChange = () => {
    if (!walletConnected) {
      alert('Veuillez d\'abord connecter votre portefeuille.');
      return;
    }
    // Changer le rôle de l'utilisateur
    setUserRole(userRole === 'entrepreneur' ? 'investisseur' : 'entrepreneur');
  };

  // Fonction pour gérer les votes
  const handleVote = async () => {
    if (selectedProject && voteAmount > 0 && voteAmount <= selectedProject.tokenBalance) {
      // Enregistrer le vote dans le tableau des votes
      setVotes((prevVotes) => [
        ...prevVotes,
        { projectName: selectedProject.name, investor: account!, amount: voteAmount },
      ]);
      alert(`Vous avez voté pour le projet ${selectedProject.name} avec ${voteAmount} tokens.`);
      setVoteAmount(0);  // Réinitialiser le montant du vote
    } else {
      alert('Veuillez entrer un nombre valide de tokens pour voter.');
    }
  };

  const handleProjectCreate = (project: Project) => {
    setProjects((prevProjects) => [...prevProjects, project]);
    setAlertMessage(`Le projet "${project.name}" a été créé avec succès!`);
    setTimeout(() => setAlertMessage(null), 3000);  // Masquer l'alerte après 3 secondes
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col font-sans">
      {/* En-tête */}
      <Header connectWallet={connectWallet} account={account} />

      <div className="mt-[42px] w-full container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl shadow-lg rounded-lg bg-blue-700 p-3 w-full font-semibold text-center text-white mb-8">
          Listing Décentralisé de Projets
        </h1>

        {/* Affichage de l'alerte de création de projet */}
        {alertMessage && (
          <div className="bg-green-500 text-white p-4 rounded-lg text-center mb-6">
            {alertMessage}
          </div>
        )}

        {/* Enlarge the button for switching roles */}
        {walletConnected && (
          <div className="flex justify-center mb-4">
            <button
              onClick={handleRoleChange}
              className="bg-blue-600 text-white py-4 px-10 rounded-lg hover:bg-blue-700 focus:outline-none text-xl"
            >
              Passer en mode {userRole === 'entrepreneur' ? 'Investisseur' : 'Entrepreneur'}
            </button>
          </div>
        )}

        {/* Afficher le formulaire pour l'entrepreneur */}
        {userRole === 'entrepreneur' && walletConnected && (
          <div className="mb-8">
            <CreateProjectForm onProjectCreate={handleProjectCreate} />
          </div>
        )}

        {/* Liste des projets pour les investisseurs */}
        {userRole === 'investisseur' && (
          <div className="W-full">
            <h2 className="text-4xl shadow-lg rounded-lg bg-blue-700 p-3 w-full font-semibold text-center text-white mb-6">
              Liste des Projets (POUR LES VOTES DES INVESTISSEURS)
            </h2>

            <div className="flex flex-wrap justify-between items-center w-full">
              {projects.map((project, index) => (
                <div
                  key={project.name}
                  className="flex flex-col w-full sm:w-[48%] lg:w-[30%] p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer mb-6"
                  onClick={() => setSelectedProject(project)}
                  style={{ transition: 'transform 0.3s' }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-xl text-gray-800">{index + 1}. {project.name}</span>
                    <span className="text-sm text-gray-500">{project.tokenSymbol}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Tokens Disponibles: {project.tokenBalance}</p>
                    <p>Valeur par token: {project.tokenValue[selectedCurrency]} FCFA</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Détails du projet sélectionné pour les investisseurs */}
        {selectedProject && userRole === 'investisseur' && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800">{selectedProject.name}</h2>
            <p className="mt-2 text-gray-700">Créateur: {selectedProject.creator}</p>
            <p className="mt-2 text-gray-700">Symbole du Token: {selectedProject.tokenSymbol}</p>
            <p className="mt-2 text-gray-700">Tokens disponibles: {selectedProject.tokenBalance}</p>
            <p className="mt-2 text-gray-700">Description: {selectedProject.description}</p>

            <div className="mt-6">
              <label className="block text-lg font-semibold text-gray-700 mb-2">Nombre de Tokens pour voter</label>
              <input
                type="number"
                value={voteAmount}
                onChange={(e) => setVoteAmount(Number(e.target.value))}
                className="border p-3 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez le nombre de tokens"
                max={selectedProject.tokenBalance}
              />
              <button
                onClick={handleVote}
                className="mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-700 focus:outline-none transition-colors duration-300"
              >
                Voter
              </button>
            </div>
          </div>
        )}

        {/* Affichage des votes */}
        {votes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold">Votes des Investisseurs</h3>
            <div className="mt-4">
              {votes.map((vote, index) => (
                <div key={index} className="p-4 bg-gray-200 rounded-lg mb-4">
                  <p className="text-sm">Projet: {vote.projectName}</p>
                  <p className="text-sm">Investisseur: {vote.investor}</p>
                  <p className="text-sm">Montant voté: {vote.amount} tokens</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interface;
