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
    MateriaPrima [] public materia_prima;
    Prodotti [] public prodotti;

    function creaToken()  public{
        CarbonFootprint token=CarbonFootprint(carbonFootprintContract);
        uint256 tokenId=token.safeMint(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4);
        materia_prima[0]=MateriaPrima({
            id_lottomateria:0,
            nome:"latte",
            owner:0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,
            token:tokenId
        });
        
    }
    function getToken() view public returns (MateriaPrima memory){
        return materia_prima[0];
    }
    


}