// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {OrbitNFT} from "../src/bridgeIntent.sol";

contract OrbitNFTTest is Test {
    OrbitNFT public orbitNFT;
    address public user=address(0x1234);

    function setUp() public {
        orbitNFT = new OrbitNFT();
    }

    function test_mint()public{
        // Set up the user and give them some ETH
        vm.deal(user, 1 ether);

        vm.prank(user);
        uint256 tokenId=orbitNFT.mint();

        assertEq(tokenId,1,"Token id should be 1");
        assertEq(orbitNFT.ownerOf(tokenId),user,"User should own the token ");
        assertEq(orbitNFT.nextId(), 1, "nextId should be 1");
    }
    
    function test_bridgeToL2() public {
        // First mint an NFT
        vm.prank(user);
        uint256 tokenId = orbitNFT.mint();
        
        // Verify user owns it
        assertEq(orbitNFT.ownerOf(tokenId), user, "User should own NFT before bridge");
        
        // Now bridge it to L2
        vm.expectEmit(true, true, true, true);
        emit OrbitNFT.BridgeIntent(tokenId, user, bytes32(uint256(uint160(user))));
        
        vm.prank(user);
        orbitNFT.bridgeToL2(tokenId);
        
        // Verify NFT is burned (should revert when checking owner)
        vm.expectRevert();
        orbitNFT.ownerOf(tokenId);
    }
    
    function test_bridgeToL2_only_owner() public {
        // User mints NFT
        vm.prank(user);
        uint256 tokenId = orbitNFT.mint();
        
        // Attacker tries to bridge user's NFT
        address attacker = address(0x9999);
        vm.prank(attacker);
        vm.expectRevert("Not token owner");
        orbitNFT.bridgeToL2(tokenId);
    }
}
