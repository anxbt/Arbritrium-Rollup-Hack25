// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract OrbitNFT is ERC721, Ownable {
    uint256 public nextId;
    event BridgeIntent(uint256 tokenId, address owner, bytes32 dest);

    constructor() ERC721("OrbitNFT", "ONFT") Ownable(msg.sender) {}

    // Step 1: User mints NFT on L3 (normal minting, no bridge)
    function mint() external returns (uint256) {
        uint256 id = ++nextId;
        _mint(msg.sender, id);
        return id;
    }

    // Step 2: User bridges NFT from L3 to L2 (burns and emits intent)
    function bridgeToL2(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        
        // Emit bridge intent before burning
        emit BridgeIntent(tokenId, msg.sender, bytes32(uint256(uint160(msg.sender))));
        
        // Burn the NFT on L3 (one-way bridge)
        _burn(tokenId);
    }
}


