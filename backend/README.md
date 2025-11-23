# NFT Bridge Relayer

Automated relayer service that listens to bridge events on L3 and automatically redeems NFTs on L2.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env` (already configured for local Anvil chains)

3. Start the relayer:
```bash
npm start
```

## How It Works

1. Listens to `BridgeIntent` events on L3 (port 8545)
2. Extracts tokenId, owner, and destination from events
3. Computes intent hash: `keccak256(tokenId, owner, dest)`
4. Calls `redeem(intentHash, l3TokenId, owner)` on L2 (port 8546)
5. Waits for transaction confirmation and logs success

## Features

- ✅ Processes historical events on startup (last 1000 blocks)
- ✅ Real-time event listening
- ✅ Duplicate prevention (checks `consumedIntents` mapping)
- ✅ Graceful shutdown (Ctrl+C)
- ✅ Error handling and logging

## Requirements

- Node.js 18+ (for native ES modules support)
- Running Anvil chains on ports 8545 (L3) and 8546 (L2)
- Deployed OrbitNFT and L2BridgeNFT contracts
