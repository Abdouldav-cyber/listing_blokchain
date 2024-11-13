import React from 'react';

interface HeaderProps {
  connectWallet: () => void;
  account: string | null;
}

const Header: React.FC<HeaderProps> = ({ connectWallet, account }) => {
  return (
    <header className="  bg-blue-600 fixed w-full text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Projets Décentralisés</h1>
      {!account ? (
        <button 
          onClick={connectWallet}
          className="bg-blue-700 hover:bg-blue-800 py-2 px-4 rounded-lg"
        >
          Connexion Entrepreneur
        </button>
      ) : (
        <span className="text-sm">Connecté en tant que {account}</span>
      )}
    </header>
  );
};

export default Header;
