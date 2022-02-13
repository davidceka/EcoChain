// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CarbonFootprint is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    mapping(uint256=>uint256) impattoAmbientale;


    constructor() ERC721("CarbonFootprint", "CFP") {
    }
//la funzione seguente crea un nuovo NFT e aggiorna il contatore NFT
    function safeMint(address to,uint256 _impattoAmbientale) public returns (uint256){
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(to, tokenId);
        impattoAmbientale[tokenId]=_impattoAmbientale;

        _tokenIdCounter.increment();

        return tokenId;
    }
    function getImpattoAmbientale(uint256 _tokenId) view public returns (uint256){
        require(_exists(_tokenId));
        return impattoAmbientale[_tokenId];
    }
    
    //chiedere se va bene solo il salvataggio dell'URI semplice (singola stringa) oppure si necessita di creare un JSON
}
