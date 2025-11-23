import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load ABIs
const OrbitNFTABI = JSON.parse(
  readFileSync(join(__dirname, 'abis/OrbitNFT.json'), 'utf8')
);
const L2BridgeNFTABI = JSON.parse(
  readFileSync(join(__dirname, 'abis/L2BridgeNFT.json'), 'utf8')
);

class NFTBridgeRelayer {
  constructor() {
    // L3 Provider (read-only for listening to events)
    this.l3Provider = new ethers.JsonRpcProvider(process.env.L3_RPC_URL);
    
    // L2 Provider with signer (for sending transactions)
    this.l2Provider = new ethers.JsonRpcProvider(process.env.L2_RPC_URL);
    this.l2Signer = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, this.l2Provider);
    
    // Contract instances
    this.l3Contract = new ethers.Contract(
      process.env.L3_CONTRACT_ADDRESS,
      OrbitNFTABI,
      this.l3Provider
    );
    
    this.l2Contract = new ethers.Contract(
      process.env.L2_CONTRACT_ADDRESS,
      L2BridgeNFTABI,
      this.l2Signer
    );
    
    this.processedEvents = new Set();
    this.isRunning = false;
  }

  // Compute intent hash the same way as in the test script
  computeIntentHash(tokenId, owner, dest) {
    return ethers.keccak256(
      ethers.solidityPacked(
        ['uint256', 'address', 'bytes32'],
        [tokenId, owner, dest]
      )
    );
  }

  async handleBridgeIntent(tokenId, owner, dest, eventLog) {
    const eventId = `${eventLog.transactionHash}-${eventLog.index}`;
    
    // Prevent duplicate processing
    if (this.processedEvents.has(eventId)) {
      console.log(`⏭️  Event already processed: ${eventId}`);
      return;
    }

    try {
      console.log('\n🌉 Bridge Intent Detected!');
      console.log(`  Token ID: ${tokenId}`);
      console.log(`  Owner: ${owner}`);
      console.log(`  Dest: ${dest}`);
      console.log(`  Tx Hash: ${eventLog.transactionHash}`);

      // Compute intent hash
      const intentHash = this.computeIntentHash(tokenId, owner, dest);
      console.log(`  Intent Hash: ${intentHash}`);

      // Check if already consumed on L2
      const isConsumed = await this.l2Contract.consumedIntents(intentHash);
      if (isConsumed) {
        console.log('⚠️  Intent already consumed on L2, skipping...');
        this.processedEvents.add(eventId);
        return;
      }

      // Call redeem on L2
      console.log('📝 Sending redeem transaction to L2...');
      const tx = await this.l2Contract.redeem(intentHash, tokenId, owner);
      console.log(`  Tx Hash: ${tx.hash}`);
      
      // Wait for confirmation
      console.log('⏳ Waiting for confirmation...');
      const receipt = await tx.wait();
      console.log(`✅ NFT Redeemed on L2! Block: ${receipt.blockNumber}`);
      
      // Mark as processed
      this.processedEvents.add(eventId);
      
    } catch (error) {
      console.error('❌ Error handling bridge intent:', error.message);
      if (error.reason) console.error('   Reason:', error.reason);
    }
  }

  async processHistoricalEvents() {
    try {
      console.log('🔍 Checking for historical bridge events...');
      const currentBlock = await this.l3Provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 1000); // Last 1000 blocks
      
      const filter = this.l3Contract.filters.BridgeIntent();
      const events = await this.l3Contract.queryFilter(filter, fromBlock, currentBlock);
      
      console.log(`   Found ${events.length} historical events`);
      
      for (const event of events) {
        // Extract indexed parameters from topics
        const tokenId = event.args[0];
        const owner = event.args[1];
        const dest = event.args[2];
        
        await this.handleBridgeIntent(tokenId, owner, dest, event);
      }
    } catch (error) {
      console.error('❌ Error processing historical events:', error.message);
    }
  }

  async start() {
    if (this.isRunning) {
      console.log('⚠️  Relayer is already running');
      return;
    }

    console.log('🚀 Starting NFT Bridge Relayer...');
    console.log(`   L3 RPC: ${process.env.L3_RPC_URL}`);
    console.log(`   L2 RPC: ${process.env.L2_RPC_URL}`);
    console.log(`   L3 Contract: ${process.env.L3_CONTRACT}`);
    console.log(`   L2 Contract: ${process.env.L2_CONTRACT}`);
    console.log(`   Relayer Address: ${this.l2Signer.address}`);
    
    this.isRunning = true;

    // Process any historical events first
    await this.processHistoricalEvents();

    // Listen for new BridgeIntent events
    console.log('\n👂 Listening for BridgeIntent events on L3...\n');
    
    this.l3Contract.on('BridgeIntent', async (tokenId, owner, dest, event) => {
      await this.handleBridgeIntent(tokenId, owner, dest, event.log);
    });

    // Keep the process alive
    console.log('✨ Relayer is running. Press Ctrl+C to stop.\n');
  }

  async stop() {
    console.log('\n🛑 Stopping relayer...');
    this.l3Contract.removeAllListeners();
    this.isRunning = false;
    console.log('✅ Relayer stopped');
  }
}

export default NFTBridgeRelayer;
