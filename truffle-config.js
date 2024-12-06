/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation, and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * https://trufflesuite.com/docs/truffle/reference/configuration
 */

// **Uncomment these lines if using Infura for Deployment**
// require('dotenv').config();
// const { MNEMONIC, PROJECT_ID } = process.env;
// const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config(); // Charge les variables d'environnement
const HDWalletProvider = require('@truffle/hdwallet-provider');

// Chargez la clé privée et l'URL Infura depuis les variables d'environnement
const privateKey = process.env.PRIVATE_KEY;
const infuraUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;

module.exports = {
  networks: {
    sepolia: {
      provider: () =>
        new HDWalletProvider({
          privateKeys: [privateKey],
          providerOrUrl: infuraUrl,
          pollingInterval: 10000, // Augmente le délai d'interrogation
        }),
      network_id: 11155111,
      gas: 4500000,
      gasPrice: 20000000000, // Augmenter légèrement si nécessaire
      timeoutBlocks: 500, // Augmente le nombre de blocs pour l'expiration
      networkCheckTimeout: 120000, // Timeout réseau étendu
      skipDryRun: true, // Désactive le test de migration
    },
    
  compilers: {
    solc: {
      version: "0.8.20", // Version du compilateur Solidity
    },
  },
},
};