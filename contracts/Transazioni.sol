// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./CarbonFootprint.sol";

contract Transazione {

    address carbonFootprintContract;

    constructor (address _carbonFootprintContract){
        carbonFootprintContract=_carbonFootprintContract;
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
        CarbonFootprint token=CarbonFootprint(carbonFootprintContract);
        uint256 tokenId=token.safeMint(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2);
        materia_prima[0]=MateriaPrima({
            id_lottomateria:0,
            nome:"pomodori",
            owner:0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,
            token:1
        });
        
    }
    function getToken() view public returns (MateriaPrima memory){
        return materia_prima[0];
    }
    


}