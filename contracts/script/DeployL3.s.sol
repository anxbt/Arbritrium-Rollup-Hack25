// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {OrbitNFT} from "../src/bridgeIntent.sol";

/**
 * @title DeployL3
 * @notice Deploys the OrbitNFT contract on L3 (Orbit chain)
 * @dev Run with: forge script script/DeployL3.s.sol:DeployL3 --rpc-url <L3_RPC> --broadcast
 */
contract DeployL3 is Script {
    OrbitNFT public orbitNFT;

    function run() public {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy OrbitNFT contract
        orbitNFT = new OrbitNFT();
        
        // Log deployment address
        console.log("=== L3 DEPLOYMENT ===");
        console.log("OrbitNFT deployed to:", address(orbitNFT));
        console.log("Deployer (owner):", msg.sender);
        console.log("====================");

        vm.stopBroadcast();
    }
}
