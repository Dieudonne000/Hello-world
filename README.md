# Hello World DApp

A simple decentralized application using Ethereum, Truffle, and Web3.js.

## Prerequisites

- Node.js (v16 or higher)
- Ganache (GUI or CLI)
- MetaMask browser extension

## Quick Start

1. Start Ganache
   - Open Ganache GUI
   - Create a new workspace (or use the default one)
   - Make sure it's running on `http://127.0.0.1:7545`

2. Configure MetaMask
   - Open MetaMask
   - Add a new network:
     - Network Name: Ganache
     - New RPC URL: http://127.0.0.1:7545
     - Chain ID: 1337
     - Currency Symbol: ETH
   - Import a Ganache account:
     - Copy private key from Ganache (click the key icon)
     - In MetaMask: click account icon -> Import Account -> Paste private key

3. Clone and Run:
```bash
# Clone the repository
git clone <your-repo-url>
cd <repo-name>

# Install dependencies and deploy contract
npm run setup

# Start the application
npm start
```

4. Open your browser to `http://localhost:3000`

## Common Issues

1. "Contract not deployed on this network"
   - Make sure Ganache is running
   - Run `npm run setup` again

2. "MetaMask not connected"
   - Make sure you've added the Ganache network to MetaMask
   - Make sure you've imported a Ganache account
   - Connect MetaMask to the Ganache network

3. Stuck on "Loading..."
   - Open browser console (F12) to check for errors
   - Make sure MetaMask is connected to Ganache network
   - Try resetting your MetaMask account:
     1. Open MetaMask
     2. Click the account icon
     3. Settings -> Advanced
     4. Click "Reset Account"
   - Run `npm run setup` again
   - Clear browser cache and refresh the page 