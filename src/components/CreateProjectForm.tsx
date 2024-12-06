import React, { useState } from 'react';

interface CreateProjectFormProps {
  onProjectCreate: (project: {
    name: string;
    description: string;
    tokenBalance: number;
    creator: string;
    tokenSymbol: string;
    tokenValue: { fcfa: number }; // Valeur du token uniquement en FCFA
  }) => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onProjectCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState(0);
  const [symbol, setSymbol] = useState('');
  const [creator, setCreator] = useState('');
  const [tokenValueFcfa, setTokenValueFcfa] = useState(0); // Valeur du token en FCFA

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Créer le projet et le transmettre à Interface.tsx via la prop onProjectCreate
    onProjectCreate({
      name,
      description,
      tokenBalance: targetAmount,  // Utilise targetAmount comme le solde des tokens
      creator,
      tokenSymbol: symbol,
      tokenValue: { fcfa: tokenValueFcfa }, // Passe seulement la valeur en FCFA
    });

    // Réinitialiser le formulaire
    setName('');
    setDescription('');
    setTargetAmount(0);
    setSymbol('');
    setCreator('');
    setTokenValueFcfa(0);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-6">
      <h3 className="text-2xl font-semibold mb-6 text-center">Créer un Nouveau Projet</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nom du projet</label>
          <input
            id="name"
            type="text"
            placeholder="Nom du projet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description du projet</label>
          <textarea
            id="description"
            placeholder="Description du projet"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="nombretokens" className="block text-sm font-medium text-gray-700 mb-2">Objectif en tokens</label>
          <input
            id="nombretokens"
            type="number"
            placeholder="Objectif en tokens"
            value={targetAmount}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>

        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-2">Symbole du token</label>
          <input 
            id="symbol"
            type="text"
            placeholder="Symbole du token"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="creator" className="block text-sm font-medium text-gray-700 mb-2">Porteur du projet</label>
          <input
            id="creator"
            type="text"
            placeholder="Porteur du projet"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Ajout du champ pour la valeur du token en FCFA uniquement */}
        <div>
          <label htmlFor="tokenValueFcfa" className="block text-sm font-medium text-gray-700 mb-2">Valeur du token en FCFA</label>
          <input
            min="1"
            id="tokenValueFcfa"
            type="number"
            placeholder="Valeur du token en FCFA"
            value={tokenValueFcfa}
            onChange={(e) => setTokenValueFcfa(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Créer le projet
        </button>
      </form>
    </div>
  );
};

export default CreateProjectForm;
