// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, stdError} from "forge-std/Test.sol";
import {L2BridgeNFT} from "../src/bridgeManager.sol";

contract L2BridgeNFTTest is Test {
    L2BridgeNFT public l2Bridge;
    address public relayer;
    address public user = address(0x123);

    function setUp() public {
        relayer = address(this);
        l2Bridge = new L2BridgeNFT();
    }

    function test_redeem_success() public {
        // Simulate L3 bridge intent data
        uint256 l3TokenId = 1;
        bytes32 intentHash = keccak256(abi.encode(l3TokenId, user, 0));

        //Expect Redeemed event
        vm.expectEmit(true, true, true, true);
        emit L2BridgeNFT.Redeemed(l3TokenId, user);

        //relayer calls redeem
        l2Bridge.redeem(intentHash, l3TokenId, user);

        assertTrue(
            l2Bridge.consumedIntents(intentHash),
            "Intent should be consumed"
        );
    }

    function test_redeem_prevent_double_spend() public {
        uint256 l3TokenId = 1;
        bytes32 intentHash = keccak256(abi.encode(l3TokenId, user, 0));

        // First redemption succeeds
        l2Bridge.redeem(intentHash, l3TokenId, user);
        
        // Second redemption should fail
        vm.expectRevert("already consumed");
        l2Bridge.redeem(intentHash, l3TokenId, user);
    }

    function test_redeem_only_owner() public {
        uint256 l3TokenId = 1;
        bytes32 intentHash = keccak256(abi.encode(l3TokenId, user, 0));
        address attacker = address(0x5678);
        
        // Non-owner tries to call redeem
        vm.prank(attacker);
        vm.expectRevert();
        l2Bridge.redeem(intentHash, l3TokenId, attacker);
    }
}
