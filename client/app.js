let contract;
let web3;

async function init() {
    console.log('Starting initialization...');
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed');
        try {
            // Request account access
            console.log('Requesting account access...');
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Accounts:', accounts);
            
            console.log('Initializing Web3...');
            web3 = new Web3(window.ethereum);
            
            // Check if we're connected to the right network
            console.log('Checking network...');
            const networkId = await web3.eth.net.getId();
            console.log('Connected to network ID:', networkId);
            
            // Get the contract ABI from the contracts folder
            console.log('Fetching contract JSON...');
            const response = await fetch('/contracts/HelloWorld.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contractJson = await response.json();
            console.log('Contract JSON loaded:', {
                abi: contractJson.abi ? 'Present' : 'Missing',
                networks: Object.keys(contractJson.networks || {})
            });
            
            // Check if the contract is deployed on this network
            if (!contractJson.networks[networkId]) {
                console.error('Contract not found for network:', networkId);
                throw new Error('Please make sure you are connected to the correct network');
            }
            
            // Get the contract address from the deployed network
            const contractAddress = contractJson.networks[networkId].address;
            console.log('Contract address:', contractAddress);
            
            console.log('Initializing contract instance...');
            contract = new web3.eth.Contract(
                contractJson.abi,
                contractAddress
            );
            console.log('Contract instance created');

            // Verify contract is accessible
            const connectedAccounts = await web3.eth.getAccounts();
            console.log('Connected account:', connectedAccounts[0]);

            // Load the initial message
            console.log('Loading initial message...');
            await refreshMessage();
            
            // Setup event listeners for MetaMask account changes
            console.log('Setting up event listeners...');
            window.ethereum.on('accountsChanged', function (accounts) {
                console.log('Account changed to:', accounts[0]);
                refreshMessage();
            });

            showStatus('Connected to MetaMask successfully!', false);
            console.log('Initialization complete!');

        } catch (error) {
            console.error('Initialization error:', error);
            showStatus('Error connecting to MetaMask: ' + error.message, true);
            console.error('Detailed error:', error);
        }
    } else {
        console.error('MetaMask not installed');
        showStatus('Please install MetaMask to use this dApp', true);
    }
}

async function refreshMessage() {
    console.log('Starting refreshMessage...');
    try {
        const accounts = await web3.eth.getAccounts();
        console.log('Fetching message using account:', accounts[0]);
        
        if (!contract || !contract.methods) {
            console.error('Contract not properly initialized:', { 
                contract: !!contract,
                methods: contract ? !!contract.methods : false 
            });
            throw new Error('Contract not properly initialized');
        }
        
        console.log('Calling getMessage...');
        const message = await contract.methods.getMessage().call({ from: accounts[0] });
        console.log('Retrieved message:', message);
        document.getElementById('message').innerText = message;
        console.log('Message updated in DOM');
    } catch (error) {
        console.error('Error in refreshMessage:', error);
        showStatus('Error fetching message: ' + error.message, true);
        console.error('Detailed error:', error);
    }
}

async function setNewMessage() {
    console.log('Starting setNewMessage...');
    const newMessage = document.getElementById('newMessage').value;
    if (!newMessage) {
        console.log('No message entered');
        showStatus('Please enter a message', true);
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        console.log('Setting new message from account:', accounts[0]);
        showStatus('Transaction pending...');
        
        console.log('Sending transaction...');
        const result = await contract.methods.setMessage(newMessage)
            .send({ from: accounts[0] });
        console.log('Transaction result:', result);
        
        showStatus('Message updated successfully!', false);
        console.log('Refreshing message display...');
        await refreshMessage();
        document.getElementById('newMessage').value = '';
    } catch (error) {
        console.error('Error in setNewMessage:', error);
        showStatus('Error updating message: ' + error.message, true);
    }
}

function showStatus(message, isError = false) {
    console.log(`Status update (${isError ? 'error' : 'success'}):`, message);
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = message;
    statusDiv.className = 'status ' + (isError ? 'error' : 'success');
}

// Initialize the app when the window loads
console.log('Setting up load handler...');
window.addEventListener('load', init); 