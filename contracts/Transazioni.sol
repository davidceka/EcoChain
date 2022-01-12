// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./CarbonFootprint.sol";

contract Transazione {
    CarbonFootprint tokenContract;

    constructor (address _carbonFootprintContract){
        tokenContract=CarbonFootprint(_carbonFootprintContract);
    }



    struct MateriaPrima{
        uint256 id_lottomateria;
        string nome;
        address owner;
        uint256 token;    
    }


    struct Prodotti{

        uint256 id_prodotto;
        string nome;
        address owner;

    }
    mapping(uint256=>MateriaPrima) public materia_prima;
    mapping(uint256=>Prodotti) public prodotti;

    function creaToken()  public{
        uint256 tokenId=tokenContract.safeMint(msg.sender);
        materia_prima[0]=MateriaPrima({
            id_lottomateria:0,
            nome:"pomodori",
            owner:msg.sender,
            token:tokenId
        });
        
    }
    function getToken() view public returns (MateriaPrima memory){
        return materia_prima[0];
    }
    


}