import NFTBridgeRelayer from './relayer.js';

// Validate environment variables
const requiredEnvVars = [
  'L3_RPC_URL',
  'L2_RPC_URL',
  'L3_CONTRACT_ADDRESS',
  'L2_CONTRACT_ADDRESS',
  'RELAYER_PRIVATE_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  process.exit(1);
}

// Create and start relayer
const relayer = new NFTBridgeRelayer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await relayer.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await relayer.stop();
  process.exit(0);
});

// Handle unhandled errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Start the relayer
relayer.start().catch((error) => {
  console.error('❌ Failed to start relayer:', error);
  process.exit(1);
});
