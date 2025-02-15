const CONTRACT_CONFIG = {
    requiredNetwork: {
        ids: [1337, 5777],  // Valid network IDs for Ganache
        names: ['Ganache', 'Ganache GUI']
    },
    gasLimit: {
        read: 100000,    // Gas limit for read operations
        write: 200000    // Gas limit for write operations
    },
    // Add supported Web3 versions
    web3Versions: ['1.9.0', '1.10.0']
};

export default CONTRACT_CONFIG; 