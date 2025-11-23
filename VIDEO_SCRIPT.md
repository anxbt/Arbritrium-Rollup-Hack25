# 90-Second Demo Video Script

## Setup (Do Before Recording)
1. Start Nitro node: `cd nitro-devnode && ./run-dev-node.sh`
2. Start Anvil L2: `anvil --port 8546 --chain-id 421614`
3. Deploy contracts (both chains)
4. Start relayer: `cd backend && npm start`
5. Open 4 terminal windows visible:
   - Terminal 1: Nitro node logs (background)
   - Terminal 2: Relayer logs
   - Terminal 3: Demo commands
   - Terminal 4: Anvil L2 (optional)

## Video Timeline (90 seconds)

### 0:00-0:15 - Introduction (15s)
**Say:**
> "This is an intent-based NFT bridge between Arbitrum Orbit L3 and L2. Users declare intent on L3, trustless relayers fulfill on L2."

**Show:**
- README.md open showing the architecture diagram
- Quick pan across terminal windows

### 0:15-0:30 - Show Real Nitro Stack (15s)
**Say:**
> "This is a real Arbitrum Orbit chain running Nitro v3.7.1 with ArbOS, not a simple Anvil mock."

**Show:**
- Nitro terminal with chain startup logs
- Highlight: "Chain ID: 412346", "ArbOS enabled"

**Run:**
```bash
cast chain-id --rpc-url http://127.0.0.1:8547
# Shows: 412346

cast code 0x00000000000000000000000000000000000000ff --rpc-url http://127.0.0.1:8547
# Shows ArbOS precompile bytecode
```

### 0:30-0:45 - Mint NFT on L3 (15s)
**Say:**
> "First, I mint an NFT on the L3 Orbit chain."

**Run:**
```bash
export L3=0x5FbDB2315678afecb367f032d93F642f64180aa3
export PK=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

cast send $L3 "mint()" --rpc-url http://127.0.0.1:8547 --private-key $PK
```

**Show:**
- Transaction succeeds
- Quickly verify: `cast call $L3 "ownerOf(uint256)" 1 --rpc-url http://127.0.0.1:8547`

### 0:45-1:10 - Bridge to L2 (25s)
**Say:**
> "Now I bridge it to L2. The contract burns the NFT and emits a BridgeIntent event."

**Run:**
```bash
cast send $L3 "bridgeToL2(uint256)" 1 --rpc-url http://127.0.0.1:8547 --private-key $PK
```

**Show:**
- Transaction receipt (status: success)
- **Switch to relayer terminal** - highlight:
  ```
  🌉 Bridge Intent Detected!
    Token ID: 1
    Owner: 0xf39F...
    Intent Hash: 0x...
  📝 Sending redeem transaction to L2...
  ✅ NFT Redeemed on L2! Block: 2
  ```

**Say:**
> "The relayer automatically detects the event, computes the intent hash, and redeems on L2 in seconds."

### 1:10-1:30 - Verify on L2 (20s)
**Say:**
> "Let's verify the NFT now exists on L2 and was burned on L3."

**Run:**
```bash
export L2=0x5FbDB2315678afecb367f032d93F642f64180aa3
export OWNER=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# Check L2 - should succeed
cast call $L2 "ownerOf(uint256)" 1 --rpc-url http://127.0.0.1:8546
# Returns: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# Check L3 - should fail
cast call $L3 "ownerOf(uint256)" 1 --rpc-url http://127.0.0.1:8547
# Error: token doesn't exist (burned)
```

**Show:**
- L2 query succeeds (owner address returned)
- L3 query fails (NFT burned)

**Say:**
> "Perfect. The NFT was trustlessly bridged from L3 to L2 with zero user interaction after the initial transaction."

## Quick Tips for Recording

### Best Practices
- **Use QuickTime / OBS** - Screen recording with audio
- **Zoom terminal text** - Make sure font is readable (16pt+)
- **Slow down commands** - Pause 1-2s after each command
- **Highlight key outputs** - Use mouse to point at important logs
- **Practice once** - Do a dry run to hit 90s timing

### Terminal Setup
```bash
# Make text bigger
export PS1="\W \$ "  # Shorter prompt
# Increase font size in terminal settings to 16-18pt
```

### If You Go Over 90 Seconds
Cut these sections:
- ❌ Skip showing Anvil L2 terminal
- ❌ Skip checking ArbOS precompile
- ❌ Skip the L3 burn verification
- ✅ Keep: Nitro proof, mint, bridge, relayer logs, L2 verify

### Recording Commands in One Block
```bash
# Set everything up first
export L3=0x5FbDB2315678afecb367f032d93F642f64180aa3
export L2=0x5FbDB2315678afecb367f032d93F642f64180aa3
export OWNER=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
export PK=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Then just run:
cast send $L3 "mint()" --rpc-url http://127.0.0.1:8547 --private-key $PK && \
cast send $L3 "bridgeToL2(uint256)" 1 --rpc-url http://127.0.0.1:8547 --private-key $PK && \
sleep 3 && \
cast call $L2 "ownerOf(uint256)" 1 --rpc-url http://127.0.0.1:8546
```

## After Recording

1. **Upload to YouTube/Loom** (unlisted is fine)
2. **Update README.md** - Replace `VIDEO_LINK_HERE` with actual URL
3. **Test the link** - Make sure it's publicly accessible
4. **Optional**: Add timestamps in YouTube description

## Bonus Points (If Time Allows)

- Show contract code briefly (`contracts/src/bridgeIntent.sol`)
- Show relayer code (`backend/src/relayer.js`)
- Mention production use cases: gaming NFTs, cross-chain marketplaces
- Point to GitHub repo in video description

## Final Checklist Before Submitting

- [ ] Video is ≤90 seconds
- [ ] Audio is clear (no background noise)
- [ ] Terminal text is readable
- [ ] Shows Nitro (not just Anvil)
- [ ] Shows relayer processing event
- [ ] Shows successful L2 verification
- [ ] Link is in README.md
- [ ] Video is public/unlisted (not private)
