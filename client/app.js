import CONFIG from './src/config.js';

let contract;
let web3;

async function checkWeb3Version() {
    const version = web3.version;
    if (!CONFIG.web3Versions.includes(version)) {
        console.warn(`Warning: Untested Web3 version ${version}. Tested versions: ${CONFIG.web3Versions.join(', ')}`);
    }
}

async function checkNetwork(networkId) {
    if (!CONFIG.requiredNetwork.ids.includes(networkId)) {
        throw new Error(`Please connect to ${CONFIG.requiredNetwork.names.join(' or ')}. Current network ID: ${networkId}`);
    }
}

async function init() {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            web3 = new Web3(window.ethereum);
            
            // Check if we're connected to Ganache
            const networkId = await web3.eth.net.getId();
            if (networkId !== 5777 && networkId !== 1337) { // Both are valid Ganache network IDs
                throw new Error('Please connect MetaMask to Ganache network');
            }
            
            // Get the contract ABI from the contracts folder
            const response = await fetch('/contracts/HelloWorld.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contractJson = await response.json();
            
            // Check if the contract is deployed on this network
            if (!contractJson.networks[networkId]) {
                throw new Error('Contract not deployed on this network. Please run truffle migrate');
            }
            
            // Get the contract address from the deployed network
            const contractAddress = contractJson.networks[networkId].address;
            
            contract = new web3.eth.Contract(
                contractJson.abi,
                contractAddress
            );

            // Load the initial message
            await refreshMessage();
            
            // Setup event listeners for MetaMask account changes
            window.ethereum.on('accountsChanged', function (accounts) {
                refreshMessage();
            });

            // Setup network change listener
            window.ethereum.on('chainChanged', function(networkId) {
                window.location.reload();
            });

            showStatus('Connected to MetaMask successfully!', false);

        } catch (error) {
            showStatus('Error connecting to MetaMask: ' + error.message, true);
            console.error('Detailed error:', error);
        }
    } else {
        showStatus('Please install MetaMask to use this dApp', true);
    }
}

async function refreshMessage() {
    try {
        const accounts = await web3.eth.getAccounts();
        validateContract();
        
        const message = await contract.methods.getMessage().call({ 
            from: accounts[0],
            gas: CONFIG.gasLimit.read
        });
        
        document.getElementById('message').innerText = message;
    } catch (error) {
        handleError('Error fetching message', error);
    }
}

async function setNewMessage() {
    const newMessage = document.getElementById('newMessage').value?.trim();
    if (!newMessage) {
        showStatus('Please enter a message', true);
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        validateContract();
        
        showStatus('Transaction pending...');
        
        // Listen for the event
        contract.once('MessageUpdated', {}, (error, event) => {
            if (!error) {
                showStatus('Message updated successfully!', false);
            }
        });

        await contract.methods.setMessage(newMessage).send({ 
            from: accounts[0],
            gas: CONFIG.gasLimit.write
        });

        await refreshMessage();
        document.getElementById('newMessage').value = '';
    } catch (error) {
        handleError('Error updating message', error);
    }
}

function validateContract() {
    if (!contract?.methods?.getMessage) {
        throw new Error('Contract not properly initialized');
    }
}

function handleError(context, error) {
    console.error(context, error);
    showStatus(`${context}: ${error.message}`, true);
}

function setupEventListeners() {
    window.ethereum.on('accountsChanged', refreshMessage);
    window.ethereum.on('chainChanged', () => window.location.reload());
}

function showStatus(message, isError = false) {
    console.log(`Status: ${message}`);
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = message;
    statusDiv.className = 'status ' + (isError ? 'error' : 'success');
}

window.addEventListener('load', init);

// Export functions for button clicks
window.setNewMessage = setNewMessage; 