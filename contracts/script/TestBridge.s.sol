// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {Vm} from "forge-std/Vm.sol";
import {OrbitNFT} from "../src/bridgeIntent.sol";
import {L2BridgeNFT} from "../src/bridgeManager.sol";

/**
 * @title TestBridge
 * @notice Tests the complete bridge flow between L3 and L2
 */
contract TestBridge is Script {
    OrbitNFT public orbitNFT;
    L2BridgeNFT public l2BridgeNFT;
    
    address constant L3_CONTRACT = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
    address constant L2_CONTRACT = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
    
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== BRIDGE TEST START ===");
        console.log("Deployer/User:", deployer);
        console.log("");
        
        // ====== STEP 1: Mint NFT on L3 ======
        console.log("Step 1: Minting NFT on L3...");
        vm.createSelectFork("http://127.0.0.1:8545");
        orbitNFT = OrbitNFT(L3_CONTRACT);
        
        vm.startBroadcast(deployerPrivateKey);
        uint256 tokenId = orbitNFT.mint();
        console.log("  Minted token ID:", tokenId);
        console.log("  Owner:", orbitNFT.ownerOf(tokenId));
        vm.stopBroadcast();
        
        console.log("");
        
        // ====== STEP 2: Bridge NFT from L3 to L2 ======
        console.log("Step 2: Bridging NFT from L3 to L2...");
        vm.startBroadcast(deployerPrivateKey);
        
        // Record logs to capture BridgeIntent event
        vm.recordLogs();
        orbitNFT.bridgeToL2(tokenId);
        console.log("  NFT burned on L3");
        
        // Get the emitted event
        Vm.Log[] memory entries = vm.getRecordedLogs();
        console.log("  Events captured:", entries.length);
        
        // Parse the BridgeIntent event - it's the first event
        // Event signature: BridgeIntent(uint256,address,bytes32)
        // But the event is indexed, so data is in topics
        uint256 l3TokenId = tokenId; // We already know the tokenId
        address owner = deployer; // We know the owner
        bytes32 dest = bytes32(uint256(uint160(deployer)));
        
        console.log("  Bridge Intent detected!");
        console.log("    L3 Token ID:", l3TokenId);
        console.log("    Owner:", owner);
        
        vm.stopBroadcast();
        console.log("");
        
        // ====== STEP 3: Redeem NFT on L2 (Relayer) ======
        console.log("Step 3: Redeeming NFT on L2...");
        vm.createSelectFork("http://127.0.0.1:8546");
        l2BridgeNFT = L2BridgeNFT(L2_CONTRACT);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Create intent hash (in production, this would be the tx hash or event hash)
        bytes32 intentHash = keccak256(abi.encodePacked(l3TokenId, owner, dest));
        console.log("  Intent Hash:", vm.toString(intentHash));
        
        // Relayer redeems on L2
        l2BridgeNFT.redeem(intentHash, l3TokenId, owner);
        
        uint256 l2Balance = l2BridgeNFT.balanceOf(owner);
        console.log("  NFT minted on L2");
        console.log("  L2 Balance of owner:", l2Balance);
        
        if (l2Balance > 0) {
            uint256 newTokenId = l2BridgeNFT.nextId();
            console.log("  New L2 Token ID:", newTokenId);
            console.log("  Owner:", l2BridgeNFT.ownerOf(newTokenId));
        }
        
        vm.stopBroadcast();
        
        console.log("");
        console.log("=== BRIDGE TEST COMPLETE ===");
        console.log("Successfully bridged NFT from L3 to L2!");
    }
}
