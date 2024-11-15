import React, { useState } from 'react'; 
import Header from './Header';  
import CreateProjectForm from './CreateProjectForm';  

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
  const [projects, setProjects] = useState<Project[]>([]);  
  const [voteAmount, setVoteAmount] = useState<number>(0);
  const [userRole, setUserRole] = useState<'entrepreneur' | 'investisseur'>('entrepreneur'); 
  const [votes, setVotes] = useState<Vote[]>([]);  
  const [alertMessage, setAlertMessage] = useState<string | null>(null); 

  // Fonction pour calculer le total des votes pour un projet donné
  const calculateTotalVotes = (projectName: string) => {
    return votes
      .filter((vote) => vote.projectName === projectName)
      .reduce((total, vote) => total + vote.amount, 0);
  };

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

  const handleRoleChange = () => {
    if (!walletConnected) {
      alert('Veuillez d\'abord connecter votre portefeuille.');
      return;
    }
    setUserRole(userRole === 'entrepreneur' ? 'investisseur' : 'entrepreneur');
  };

  const handleVote = async () => {
    if (!selectedProject) {
      alert('Aucun projet sélectionné.');
      return;
    }

    if (voteAmount <= 0 || voteAmount > selectedProject.tokenBalance) {
      alert('Veuillez entrer un nombre valide de tokens pour voter.');
      return;
    }

    // Enregistrer le vote
    setVotes((prevVotes) => [
      ...prevVotes,
      { projectName: selectedProject.name, investor: account!, amount: voteAmount },
    ]);

    // Réduire le solde des tokens disponibles pour le projet sélectionné
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.name === selectedProject.name
          ? { ...project, tokenBalance: project.tokenBalance - voteAmount }
          : project
      )
    );

    // Afficher un message de confirmation
    alert(`Vous avez voté pour le projet "${selectedProject.name}" avec ${voteAmount} tokens.`);

    // Réinitialiser le montant du vote
    setVoteAmount(0);
  };

  const handleProjectCreate = (project: Project) => {
    setProjects((prevProjects) => [...prevProjects, project]);
    setAlertMessage(`Le projet "${project.name}" a été créé avec succès!`);
    setTimeout(() => setAlertMessage(null), 3000);  
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col font-sans">
      <Header connectWallet={connectWallet} account={account} />

      <div className="mt-[42px] w-full container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl shadow-lg rounded-lg bg-blue-700 p-3 w-full font-semibold text-center text-white mb-8">
          Listing Décentralisé de Projets
        </h1>

        {alertMessage && (
          <div className="bg-green-500 text-white p-4 rounded-lg text-center mb-6">
            {alertMessage}
          </div>
        )}

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

        {userRole === 'entrepreneur' && walletConnected && (
          <div className="mb-8">
            <CreateProjectForm onProjectCreate={handleProjectCreate} />
          </div>
        )}

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
                    <p>Total Votes: {calculateTotalVotes(project.name)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedProject && userRole === 'investisseur' && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800">{selectedProject.name}</h2>
            <p className="mt-2 text-gray-700">Créateur: {selectedProject.creator}</p>
            <p className="mt-2 text-gray-700">Symbole du Token: {selectedProject.tokenSymbol}</p>
            <p className="mt-2 text-gray-700">Tokens disponibles: {selectedProject.tokenBalance}</p>
            <p className="mt-2 text-gray-700">Description: {selectedProject.description}</p>
            <p className="mt-2 text-gray-700">Total des votes: {calculateTotalVotes(selectedProject.name)}</p>

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
