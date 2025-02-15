## Common Issues

1. "Contract not deployed on this network"
   - Make sure Ganache is running
   - Run `truffle migrate --reset`
   - Copy the contract artifacts as shown in step 4

2. "MetaMask not connected"
   - Make sure you've added the Ganache network to MetaMask
   - Make sure you've imported a Ganache account
   - Connect MetaMask to the Ganache network

3. "Invalid JSON" or missing contract
   - Run the copy command in step 4 again
   - Make sure the client/contracts directory exists

4. Stuck on "Loading..."
   - Open browser console (F12) to check for errors
   - Make sure MetaMask is connected to Ganache network
   - Try resetting your MetaMask account:
     1. Open MetaMask
     2. Click the account icon
     3. Settings -> Advanced
     4. Click "Reset Account"
   - Verify contract deployment:
     ```bash
     truffle migrate --reset
     cp build/contracts/HelloWorld.json client/contracts/
     ```
   - Restart the client server:
     ```bash
     cd client
     npm start
     ```
   - Clear browser cache and refresh the page 