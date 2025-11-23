// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract L2BridgeNFT is ERC721, Ownable {
    uint256 public nextId;
    mapping(bytes32 => bool) public consumedIntents;

    event Redeemed(uint256 l3TokenId, address owner);

    constructor() ERC721("BridgedNFT", "BNFT") Ownable(msg.sender) {}

    // Called by a relayer after verifying L3 event
    function redeem(bytes32 intentHash, uint256 l3TokenId, address owner) external onlyOwner {
        require(!consumedIntents[intentHash], "already consumed");
        consumedIntents[intentHash] = true;
        uint256 id = ++nextId;
        _mint(owner, id);
        emit Redeemed(l3TokenId, owner);
    }
}
