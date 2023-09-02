//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WorkItemNFT is ERC721URIStorage {

    struct Metadata { 
        string gitHubHash;
        uint256 amount;
        uint8 interestRate;
        string requestId;
    }

    mapping(uint256 => Metadata) private _metadata;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("WorkItemNFT", "WINFT") {
    }

    function mint(
        address to,
        string memory gitHash,
        string memory requestId,
        uint256 value,
        uint8 interest,
        string memory tokenURI
    ) public returns (uint256) {
        uint256 newTokenId = _tokenIds.current();

        _mint(to, newTokenId);

        _metadata[newTokenId] = Metadata(gitHash, value, interest, requestId);

        _tokenIds.increment();
        _setTokenURI(newTokenId, tokenURI);
        
        return newTokenId;
    }
   
    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        _burn(tokenId);
    }

    function getMetadata(uint256 tokenId) public view returns (Metadata memory) {
        return _metadata[tokenId];
    }
}