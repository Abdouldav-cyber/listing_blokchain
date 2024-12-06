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
  const [errorOccurred, setErrorOccurred] = useState(false);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request?.({ method: 'eth_requestAccounts' });
        if (accounts && Array.isArray(accounts)) {
          setAccount(accounts[0]);
          setWalletConnected(true);
        } else {
          console.error('Erreur : aucune adresse trouvée.');
        }
      } catch (err) {
        console.error('Erreur lors de la connexion au portefeuille :', err);
      }
    } else {
      alert('Veuillez installer MetaMask!');
    }
  };

  const handleRoleChange = () => {
    if (!walletConnected) {
      alert("Veuillez d'abord connecter votre portefeuille.");
      return;
    }
    setUserRole(userRole === 'entrepreneur' ? 'investisseur' : 'entrepreneur');
  };

  const handleVote = async () => {
    if (selectedProject && voteAmount > 0 && voteAmount <= selectedProject.tokenBalance) {
      const transactionSucceeded = Math.random() > 0.2;

      if (!transactionSucceeded) {
        setErrorOccurred(true);
        return;
      }

      alert(`Vous avez voté pour le projet "${selectedProject.name}" avec ${voteAmount} tokens.`);
      setVoteAmount(0);
      setVotes((prevVotes) => [
        ...prevVotes,
        { projectName: selectedProject.name, investor: account!, amount: voteAmount },
      ]);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.name === selectedProject.name
            ? { ...project, tokenBalance: project.tokenBalance - voteAmount }
            : project
        )
      );
    } else {
      alert('Veuillez entrer un nombre valide de tokens pour voter.');
    }
  };

  const handleRefund = () => {
    setErrorOccurred(false);
    alert('Les tokens ont été remboursés avec succès.');
  };

  const handleProjectCreate = (project: Project) => {
    setProjects((prevProjects) => [...prevProjects, project]);
    alert(`Le projet "${project.name}" a été créé avec succès.`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <Header connectWallet={connectWallet} account={account} />
      <div className="mt-[42px] w-full container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl shadow-lg rounded-lg bg-blue-700 p-3 w-full font-semibold text-center text-white mb-8">
          Listing Décentralisé de Projets
        </h1>

        <div className="flex justify-center my-6">
          <button
            onClick={handleRoleChange}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none transition duration-300"
          >
            {userRole === 'entrepreneur' ? "Passer au rôle d'investisseur" : "Passer au rôle d'entrepreneur"}
          </button>
        </div>

        {walletConnected && userRole === 'entrepreneur' && (
          <div className="mb-8">
            <CreateProjectForm onProjectCreate={handleProjectCreate} />
          </div>
        )}

        {userRole === 'investisseur' && (
          <div className="w-full">
            <h2 className="text-4xl shadow-lg rounded-lg bg-blue-700 p-3 w-full font-semibold text-center text-white mb-6">
              Liste des Projets
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {projects.map((project) => (
                <div
                  key={project.name}
                  className="max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-6"
                  onClick={() => setSelectedProject(project)}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h3>
                  <p className="text-gray-500 mb-2">Symbole: {project.tokenSymbol}</p>
                  <p className="text-gray-700 mb-2">Tokens disponibles: {project.tokenBalance}</p>
                  <p className="text-gray-700">Valeur par token: {project.tokenValue.fcfa} FCFA</p>
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
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleVote}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none transition-colors duration-300"
                >
                  Voter
                </button>
                <button
                  onClick={handleRefund}
                  className="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 focus:outline-none transition-colors duration-300"
                >
                  Rembourser
                </button>
              </div>
            </div>
          </div>
        )}

        {votes.length > 0 && !errorOccurred && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Liste des Votes</h2>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">Projet</th>
                  <th className="px-6 py-3 text-left text-gray-700">Investisseur</th>
                  <th className="px-6 py-3 text-left text-gray-700">Montant</th>
                </tr>
              </thead>
              <tbody>
                {votes.map((vote, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-6 py-3">{vote.projectName}</td>
                    <td className="px-6 py-3">{vote.investor}</td>
                    <td className="px-6 py-3">{vote.amount} tokens</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {errorOccurred && (
          <div className="mt-8 p-4 bg-red-200 text-red-800 rounded-lg shadow-md text-center">
            Une erreur est survenue. Les tokens seront remboursés.
          </div>
        )}
      </div>
    </div>
  );
};

export default Interface;
