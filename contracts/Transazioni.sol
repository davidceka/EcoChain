// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./CarbonFootprint.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Transazione {
    CarbonFootprint tokenContract;
    uint256 materiaPrimaCounter;
    uint256 prodottiCounter;

    uint256 prodottiId;
    uint256 materiePrimeId;

    constructor (address _carbonFootprintContract){
        tokenContract=CarbonFootprint(_carbonFootprintContract);
    }

    function incrementMaterie() internal{
        materiePrimeId++;
    }
    function incrementProdotti() internal{
        prodottiId++;
    }

    struct MateriaPrima{
        uint256 id_lottomateria;
        string nome;
        address owner;
        uint256 token;  
        uint256 amount;  
        bool not_available;
    }


    struct Prodotti{

        uint256 id_prodotto;
        string nome;
        address owner;
        uint256 token;

    }
    mapping(uint256=>MateriaPrima) public materia_prima;
    mapping(uint256=>Prodotti) public prodotti;

    function creaNuovaMateriaPrima(string memory _nome,uint256 _amount) public{
        uint256 tokenId=tokenContract.safeMint(msg.sender);
        materia_prima[0]=MateriaPrima({
            id_lottomateria:materiePrimeId,
            nome:_nome,
            owner:msg.sender,
            token:tokenId,
            amount:_amount
        });
        materiaPrimaCounter++;
        incrementMaterie();
    }
    function creaNuovoProdotto(string memory _nome,uint256 _lotto) public{

        // da aggiungere: ricavare l'impatto dal vecchio token e sommarlo al nuovo
        uint256 tokenId=tokenContract.safeMint(msg.sender);
        prodotti[prodottiCounter]=Prodotti({
            id_prodotto:prodottiId,
            nome:_nome,
            owner:msg.sender,
            token:tokenId
        });
        prodottiCounter++;
        incrementProdotti();
        materia_prima[_lotto].not_available=true;
        materiaPrimaCounter--;
    }

    function getMateriaPrima() view public returns (MateriaPrima memory){
        return materia_prima[0];
    }
    function getProdotto() view public returns (MateriaPrima memory){
        return materia_prima[0];
    }
    


}