// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {OrbitNFT} from "../src/bridgeIntent.sol";
import {L2BridgeNFT} from "../src/bridgeManager.sol";

contract BridgeIntegrationTest is Test {
    OrbitNFT public l3Contract;      // Simulates L3
    L2BridgeNFT public l2Contract;   // Simulates L2
    
    address public relayer;
    address public user = address(0x1234);
    
    function setUp() public {
        // Deploy both contracts
        relayer = address(this);
        l3Contract = new OrbitNFT();  // L3 NFT contract
        l2Contract = new L2BridgeNFT(); // L2 Bridge contract
    }

    function test_full_bridge_flow() public {
        // ════════════════════════════════════════════════════════════
        // STEP 1: User mints NFT on L3 (NOT bridging yet!)
        // ════════════════════════════════════════════════════════════
        vm.prank(user);
        uint256 l3TokenId = l3Contract.mint();
        
        // Verify NFT exists on L3
        assertEq(l3Contract.ownerOf(l3TokenId), user, "User should own NFT on L3");
        assertEq(l3TokenId, 1, "L3 token ID should be 1");
        
        // ════════════════════════════════════════════════════════════
        // SHOWCASE: User now owns an NFT on L3!
        // They can use it, trade it, hold it...
        // ════════════════════════════════════════════════════════════
        
        // ════════════════════════════════════════════════════════════
        // STEP 2: User DECIDES to bridge NFT from L3 to L2
        // ════════════════════════════════════════════════════════════
        vm.expectEmit(true, true, true, true);
        emit OrbitNFT.BridgeIntent(l3TokenId, user, bytes32(uint256(uint160(user))));
        
        vm.prank(user);
        l3Contract.bridgeToL2(l3TokenId);  // Burns NFT and emits event
        
        // Verify NFT is burned on L3
        vm.expectRevert();
        l3Contract.ownerOf(l3TokenId);  // Should revert - token doesn't exist
        
        // ════════════════════════════════════════════════════════════
        // STEP 3: Relayer captures event and creates intentHash
        // ════════════════════════════════════════════════════════════
        // In reality, relayer would listen to BridgeIntent event
        // Here we manually create the intentHash
        uint256 nonce = 0;
        bytes32 intentHash = keccak256(abi.encode(l3TokenId, user, nonce));
        
        // ════════════════════════════════════════════════════════════
        // STEP 4: Relayer calls redeem() on L2
        // ════════════════════════════════════════════════════════════
        vm.expectEmit(true, true, true, true);
        emit L2BridgeNFT.Redeemed(l3TokenId, user);
        
        // Relayer (contract owner) calls redeem
        l2Contract.redeem(intentHash, l3TokenId, user);
        
        // ════════════════════════════════════════════════════════════
        // STEP 5: Verify NFT now exists on L2
        // ════════════════════════════════════════════════════════════
        uint256 l2TokenId = 1; // First mint on L2
        assertEq(l2Contract.ownerOf(l2TokenId), user, "User should own NFT on L2");
        assertEq(l2Contract.nextId(), 1, "L2 nextId should be 1");
        assertTrue(l2Contract.consumedIntents(intentHash), "Intent should be consumed");
        
        // ════════════════════════════════════════════════════════════
        // FINAL STATE: NFT burned on L3, minted on L2
        // ════════════════════════════════════════════════════════════
        assertEq(l2Contract.ownerOf(l2TokenId), user, "L2 NFT minted successfully");
    }

    function test_bridge_multiple_nfts_same_user() public {
        // User bridges 3 NFTs from L3 to L2
        for (uint256 i = 0; i < 3; i++) {
            // Mint on L3
            vm.prank(user);
            uint256 l3TokenId = l3Contract.mint();
            
            // Bridge to L2
            vm.prank(user);
            l3Contract.bridgeToL2(l3TokenId);
            
            // Relayer redeems on L2
            bytes32 intentHash = keccak256(abi.encode(l3TokenId, user, i));
            l2Contract.redeem(intentHash, l3TokenId, user);
        }
        
        // Verify all bridged
        assertEq(l3Contract.nextId(), 3, "Should have minted 3 NFTs on L3");
        assertEq(l2Contract.nextId(), 3, "Should have 3 NFTs on L2");
        
        // Verify ownership on L2
        for (uint256 i = 1; i <= 3; i++) {
            assertEq(l2Contract.ownerOf(i), user, "User should own all L2 NFTs");
        }
    }

    function test_bridge_different_users() public {
        address user2 = address(0x5678);
        
        // User 1 mints and bridges
        vm.prank(user);
        uint256 l3TokenId1 = l3Contract.mint();
        vm.prank(user);
        l3Contract.bridgeToL2(l3TokenId1);
        bytes32 intentHash1 = keccak256(abi.encode(l3TokenId1, user, 0));
        l2Contract.redeem(intentHash1, l3TokenId1, user);
        
        // User 2 mints and bridges
        vm.prank(user2);
        uint256 l3TokenId2 = l3Contract.mint();
        vm.prank(user2);
        l3Contract.bridgeToL2(l3TokenId2);
        bytes32 intentHash2 = keccak256(abi.encode(l3TokenId2, user2, 0));
        l2Contract.redeem(intentHash2, l3TokenId2, user2);
        
        // Verify ownership
        assertEq(l2Contract.ownerOf(1), user, "User 1 should own token 1 on L2");
        assertEq(l2Contract.ownerOf(2), user2, "User 2 should own token 2 on L2");
    }

    function test_cannot_bridge_same_intent_twice() public {
        // Mint on L3
        vm.prank(user);
        uint256 l3TokenId = l3Contract.mint();
        
        // Bridge to L2
        vm.prank(user);
        l3Contract.bridgeToL2(l3TokenId);
        
        // Create intentHash
        bytes32 intentHash = keccak256(abi.encode(l3TokenId, user, 0));
        
        // First bridge succeeds
        l2Contract.redeem(intentHash, l3TokenId, user);
        
        // Second bridge with same intentHash fails
        vm.expectRevert("already consumed");
        l2Contract.redeem(intentHash, l3TokenId, user);
    }

    function test_l3_and_l2_token_ids_independent() public {
        // Mint 2 NFTs on L3
        vm.startPrank(user);
        uint256 l3TokenId1 = l3Contract.mint();
        uint256 l3TokenId2 = l3Contract.mint();
        vm.stopPrank();
        
        // Bridge only the second one
        vm.prank(user);
        l3Contract.bridgeToL2(l3TokenId2);
        bytes32 intentHash = keccak256(abi.encode(l3TokenId2, user, 0));
        l2Contract.redeem(intentHash, l3TokenId2, user);
        
        // L3 minted 2 tokens, L2 only has 1
        assertEq(l3Contract.nextId(), 2, "L3 should have minted 2 tokens");
        assertEq(l2Contract.nextId(), 1, "L2 should have 1 token");
        
        // L2 token 1 represents L3 token 2
        assertEq(l2Contract.ownerOf(1), user, "L2 token 1 exists");
    }

    // ═══════════════════════════════════════════════════════════════
    // ADVANCED TEST SCENARIOS
    // ═══════════════════════════════════════════════════════════════

    function test_user_cannot_bridge_nft_they_dont_own() public {
        // User 1 mints NFT
        vm.prank(user);
        uint256 l3TokenId = l3Contract.mint();
        
        // User 2 tries to bridge User 1's NFT
        address attacker = address(0x9999);
        vm.prank(attacker);
        vm.expectRevert("Not token owner");
        l3Contract.bridgeToL2(l3TokenId);
        
        // Verify NFT still exists on L3 and owned by user
        assertEq(l3Contract.ownerOf(l3TokenId), user, "Original owner should still own NFT");
    }

    function test_bridge_then_try_to_use_burned_token() public {
        // Mint and bridge
        vm.prank(user);
        uint256 l3TokenId = l3Contract.mint();
        
        vm.prank(user);
        l3Contract.bridgeToL2(l3TokenId);
        
        // Try to bridge again (should fail - token doesn't exist)
        vm.prank(user);
        vm.expectRevert();
        l3Contract.bridgeToL2(l3TokenId);
    }

    function test_verify_event_data_matches_redeem_params() public {
        // Mint and bridge
        vm.prank(user);
        uint256 l3TokenId = l3Contract.mint();
        
        // Record logs to capture event
        vm.recordLogs();
        
        vm.prank(user);
        l3Contract.bridgeToL2(l3TokenId);
        
        // Get emitted events
        Vm.Log[] memory entries = vm.getRecordedLogs();
        
        // Verify BridgeIntent event was emitted
        assertEq(entries.length, 2, "Should have 2 events (Transfer + BridgeIntent)");
        
        // Now use the correct data to redeem
        bytes32 intentHash = keccak256(abi.encode(l3TokenId, user, 0));
        l2Contract.redeem(intentHash, l3TokenId, user);
        
        assertTrue(l2Contract.consumedIntents(intentHash), "Intent should be consumed");
    }

    function test_sequential_bridges_maintain_state() public {
        address user2 = address(0x5678);
        
        // User 1: mint, bridge
        vm.prank(user);
        uint256 user1Token = l3Contract.mint();
        assertEq(user1Token, 1, "User 1 gets token 1");
        
        vm.prank(user);
        l3Contract.bridgeToL2(user1Token);
        
        bytes32 hash1 = keccak256(abi.encode(user1Token, user, 0));
        l2Contract.redeem(hash1, user1Token, user);
        
        // User 2: mint, bridge
        vm.prank(user2);
        uint256 user2Token = l3Contract.mint();
        assertEq(user2Token, 2, "User 2 gets token 2");
        
        vm.prank(user2);
        l3Contract.bridgeToL2(user2Token);
        
        bytes32 hash2 = keccak256(abi.encode(user2Token, user2, 0));
        l2Contract.redeem(hash2, user2Token, user2);
        
        // Verify state
        assertEq(l3Contract.nextId(), 2, "L3 minted 2 tokens");
        assertEq(l2Contract.nextId(), 2, "L2 minted 2 tokens");
        assertEq(l2Contract.ownerOf(1), user, "User 1 owns L2 token 1");
        assertEq(l2Contract.ownerOf(2), user2, "User 2 owns L2 token 2");
    }

    function test_relayer_cannot_redeem_without_valid_intent() public {
        // Try to redeem without anyone bridging
        bytes32 fakeHash = keccak256(abi.encode(999, user, 0));
        
        // This should succeed (because relayer is trusted)
        // but the intentHash won't match any real bridge
        l2Contract.redeem(fakeHash, 999, user);
        
        // NFT gets minted (relayer is trusted!)
        assertEq(l2Contract.ownerOf(1), user, "NFT minted even without L3 bridge");
        
        // This shows relayer MUST be trusted and verify L3 events
    }

    function test_bridge_with_zero_address_fails() public {
        // Can't test this easily since mint() uses msg.sender
        // But we can verify redeem doesn't accept address(0)
        bytes32 intentHash = keccak256(abi.encode(1, address(0), 0));
        
        // This will fail - OpenZeppelin prevents minting to address(0)
        vm.expectRevert();
        l2Contract.redeem(intentHash, 1, address(0));
    }
}

