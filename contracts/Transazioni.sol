// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./CarbonFootprint.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Transazione {
    CarbonFootprint tokenContract;

    uint256 prodottiId;
    uint256 materiePrimeId;

    constructor (address _carbonFootprintContract){
        tokenContract=CarbonFootprint(_carbonFootprintContract);
    }

    //emit ed eventi da aggiungere
    event materiaPrimaCreata(uint256 _idLotto,string nome,uint256 _amount,uint256 _impatto);
    event prodottoCreato(uint256 _idLotto,string nome,uint256 _amount,uint256 _impatto);

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
        uint256 amount;
        bool not_available;

    }
    mapping(uint256=>MateriaPrima) public materia_prima;
    mapping(uint256=>Prodotti) public prodotti;

    function creaNuovaMateriaPrima(string memory _nome,uint256 _amount, uint256 _impattoAmbientale) public{
        uint256 tokenId=tokenContract.safeMint(msg.sender,_impattoAmbientale);
        materia_prima[materiePrimeId]=MateriaPrima({
            id_lottomateria:materiePrimeId,
            nome:_nome,
            owner:msg.sender,
            token:tokenId,
            amount:_amount,
            not_available:false
        });
        emit materiaPrimaCreata(materiePrimeId,_nome,_amount,_impattoAmbientale);
        incrementMaterie();
        
    }

    function creaNuovoProdotto(string memory _nome,uint _quantitaRichiesta,uint256 _impattoAmbientale) public {

        uint256 quantitaRimanente=_quantitaRichiesta;
        uint256 quantitaDisponibile=0;
        uint256 i=0;
        while(quantitaDisponibile<=_quantitaRichiesta&&i<materiePrimeId)
        {
            if(materia_prima[i].owner==msg.sender){
                quantitaDisponibile+=materia_prima[i].amount;
            }
            i++;
        }
        //emit la quantità è sufficiente, la transazione procede
        require(quantitaDisponibile>=_quantitaRichiesta,"Quantita di materia prima non sufficiente.");
        //giustificare il for

        i=0;
        while(quantitaRimanente>0&&i<materiePrimeId) //verificare da togliere il materieprimeid
        {
            if(materia_prima[i].owner==msg.sender){
                if(materia_prima[i].amount>=quantitaRimanente){

                    materia_prima[i].amount-=quantitaRimanente;
                    quantitaRimanente=0;
                    
                    //if amount=0, emit lotto terminato

                }
                else{
                    quantitaRimanente-=materia_prima[i].amount;
                    materia_prima[i].amount=0;
                    materia_prima[i].not_available=true;
                    //aggiungere gli emit lotto terminato
                }
            }
            i++;
        }


        // da aggiungere: ricavare l'impatto dal vecchio token e sommarlo al nuovo
        uint256 tokenId=tokenContract.safeMint(msg.sender,_impattoAmbientale);
        prodotti[prodottiId]=Prodotti({
            id_prodotto:prodottiId,
            nome:_nome,
            owner:msg.sender,
            token:tokenId,
            amount:_quantitaRichiesta,
            not_available:false
        });
        emit materiaPrimaCreata(prodottiId,_nome,_quantitaRichiesta,_impattoAmbientale);
        incrementProdotti();
        
    }

    function getMateriaPrima(uint _idLotto) view public returns (MateriaPrima memory){
        require(_idLotto<=materiePrimeId,"Il lotto con ID richiesto non esiste.");
        return materia_prima[_idLotto];
    }
    function getProdotto(uint _idLotto) view public returns (Prodotti memory){
        require(_idLotto<=prodottiId,"Il lotto con ID richiesto non esiste.");
        return prodotti[_idLotto];
    }
    


}