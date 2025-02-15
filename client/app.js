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
    console.log('Starting initialization...');
    try {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            throw new Error('Please install MetaMask to use this dApp');
        }

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Connected accounts:', accounts);

        // Initialize Web3
        web3 = new Web3(window.ethereum);
        await checkWeb3Version();

        // Check network
        const networkId = await web3.eth.net.getId();
        await checkNetwork(networkId);
        
        // Load contract
        const contractJson = await loadContractJson();
        contract = await initializeContract(contractJson, networkId);

        // Setup event listeners
        setupEventListeners();

        // Load initial message
        await refreshMessage();

        showStatus('Connected to MetaMask successfully!', false);
    } catch (error) {
        handleError('Initialization error', error);
    }
}

async function loadContractJson() {
    const response = await fetch('/contracts/HelloWorld.json');
    if (!response.ok) {
        throw new Error(`Failed to load contract JSON: ${response.status}`);
    }
    return response.json();
}

async function initializeContract(contractJson, networkId) {
    if (!contractJson.networks[networkId]) {
        throw new Error('Contract not deployed on this network');
    }

    const contractAddress = contractJson.networks[networkId].address;
    console.log('Contract address:', contractAddress);

    return new web3.eth.Contract(contractJson.abi, contractAddress);
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