// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {L2BridgeNFT} from "../src/bridgeManager.sol";

/**
 * @title DeployL2
 * @notice Deploys the L2BridgeNFT contract on Arbitrum L2
 * @dev Run with: forge script script/DeployL2.s.sol:DeployL2 --rpc-url <L2_RPC> --broadcast
 */
contract DeployL2 is Script {
    L2BridgeNFT public l2BridgeNFT;

    function run() public {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy L2BridgeNFT contract
        l2BridgeNFT = new L2BridgeNFT();
        
        // Log deployment address
        console.log("=== L2 DEPLOYMENT ===");
        console.log("L2BridgeNFT deployed to:", address(l2BridgeNFT));
        console.log("Owner (relayer):", msg.sender);
        console.log("====================");

        vm.stopBroadcast();
    }
}
