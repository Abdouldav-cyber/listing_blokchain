import React, { useState } from 'react';
import Header from './Header';  // Assure-toi que ce fichier existe et est correctement implémenté.
import CreateProjectForm from './CreateProjectForm';  // Assure-toi que ce fichier existe et est correctement implémenté.

interface Project {
  name: string;
  tokenSymbol: string;
  tokenBalance: number;
  creator: string;
  description: string;
  tokenValue: { euro: number; dollar: number; fcfa: number };
}

const Interface: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);  // Liste des projets
  const [voteAmount, setVoteAmount] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('euro'); // Devise sélectionnée

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

  const handleVote = async () => {
    if (selectedProject && voteAmount > 0 && voteAmount <= selectedProject.tokenBalance) {
      alert(`Vous avez voté pour le projet ${selectedProject.name} avec ${voteAmount} tokens.`);
      setVoteAmount(0);  // Réinitialiser le montant du vote
    } else {
      alert('Veuillez entrer un nombre valide de tokens pour voter.');
    }
  };

  const handleProjectCreate = (project: Project) => {
    setProjects((prevProjects) => [...prevProjects, project]);
  };

  return (
    <div className="min-h-screen  bg-gray-100 flex flex-col font-sans">
      {/* En-tête */}
      <Header connectWallet={connectWallet} account={account} />

      <div className="mt-[42px] w-full container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl shadow-lg rounded-lg bg-blue-700  p-3 w-full font-semibold text-center text-white mb-8">Listing Décentralisé de Projets</h1>

        {/* Afficher le formulaire de création de projet si le portefeuille est connecté */}
        {walletConnected && (
          <div className="mb-8">
            <CreateProjectForm onProjectCreate={handleProjectCreate} />
          </div>
        )}

        {/* Liste des projets grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6*/}
        <div className='W-full'>
          <h2 className="text-4xl shadow-lg rounded-lg bg-blue-700  p-3 w-full font-semibold text-center text-white mb-6">Liste des Projets (POUR LES VOTES DES INVESTISEURS)</h2>

          <div className="flex flex-row w-full justify-between items-center">
            {projects.map((project, index) => (
              <div
                key={project.name}
                className="flex flex-row w-full justify-between items-center h-[40px] p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
                onClick={() => setSelectedProject(project)}
              >
                <div className=" mb-4">
                  <span className="font-semibold mr-4text-xl text-gray-800">{project.name}</span>
                  <span className="text-sm text-gray-500">{project.tokenSymbol}</span>
                </div>
                <p className="text-sm text-gray-600">Tokens Disponibles: {project.tokenBalance}</p>
                <p className="text-sm text-gray-500 mt-2">Valeur par token: {project.tokenValue[selectedCurrency]} {selectedCurrency.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Détails du projet sélectionné */}
        {selectedProject && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800">{selectedProject.name}</h2>
            <p className="mt-2 text-gray-700">Créateur: {selectedProject.creator}</p>
            <p className="mt-2 text-gray-700">Symbole du Token: {selectedProject.tokenSymbol}</p>
            <p className="mt-2 text-gray-700">Tokens disponibles: {selectedProject.tokenBalance}</p>
            <p className="mt-2 text-gray-700">Description: {selectedProject.description}</p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner la devise pour voter</label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="border p-3 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              >
                <option value="euro">Euro</option>
                <option value="dollar">Dollar</option>
                <option value="fcfa">FCFA</option>
              </select>
            </div>

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
      </div>
    </div>
  );
};

export default Interface;

