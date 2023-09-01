//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WorkItemNFT is ERC721URIStorage {

    mapping(uint256 => string) private _gitHashes;
    mapping(uint256 => string) private _requestIds;
    mapping(uint256 => uint8) private _interests;
    mapping(uint256 => uint256) private _values;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("WorkItemNFT", "WINFT") {
    }

    function mint(
        address to,
        string memory gitHash,
        string memory requestId,
        uint256 value,
        uint8 interest
    ) public returns (uint256) {
        uint256 newTokenId = _tokenIds.current();

        _mint(to, newTokenId);

        _gitHashes[newTokenId] = gitHash;
        _requestIds[newTokenId] = requestId;
        _interests[newTokenId] = interest;
        _values[newTokenId] = value;

        _tokenIds.increment();
        return newTokenId;
    }
   
    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        _burn(tokenId);
    }
}