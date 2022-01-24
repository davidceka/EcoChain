// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./CarbonFootprint.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Transazione {
    CarbonFootprint tokenContract;

    /*uint256 prodottiId;
    uint256 materiePrimeId;*/
    mapping(address=>uint256) prodottiId;
    mapping(address=>uint256) materiePrimeId;

    constructor (address _carbonFootprintContract){
        tokenContract=CarbonFootprint(_carbonFootprintContract);
    }

    //emit ed eventi da aggiungere
    event materiaPrimaCreata(uint256 _idLotto,string nome,uint256 _amount,uint256 _impatto);
    event prodottoCreato(uint256 _idLotto,string nome,uint256 _amount,uint256 _impatto);

    function incrementMaterie() internal{
        materiePrimeId[msg.sender]++;
    }
    function incrementProdotti() internal{
        prodottiId[msg.sender]++;
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
    mapping(address=>mapping(uint256=>Prodotti)) prodotti;
    mapping(address=> mapping(uint256=>MateriaPrima)) materia_prima;

    function creaNuovaMateriaPrima(string memory _nome,uint256 _amount, uint256 _impattoAmbientale) public{
        uint256 tokenId=tokenContract.safeMint(msg.sender,_impattoAmbientale);
        materia_prima[msg.sender][materiePrimeId[msg.sender]]=MateriaPrima({
            id_lottomateria:materiePrimeId[msg.sender],
            nome:_nome,
            owner:msg.sender,
            token:tokenId,
            amount:_amount,
            not_available:false
        });
        emit materiaPrimaCreata(materiePrimeId[msg.sender],_nome,_amount,_impattoAmbientale);
        incrementMaterie();
        
    }
    function creaNuovoProdotto(string memory _nome,uint _quantitaRichiesta,uint256 _impattoAmbientale) public {

        uint256 quantitaRimanente=_quantitaRichiesta;
        uint256 quantitaDisponibile=0;
        uint256 i=0;
        while(quantitaDisponibile<=_quantitaRichiesta&&i<materiePrimeId[msg.sender])
        {
            quantitaDisponibile+=materia_prima[msg.sender][i].amount;
            i++;
        }
        //emit la quantità è sufficiente, la transazione procede
        require(quantitaDisponibile>=_quantitaRichiesta,"Quantita di materia prima non sufficiente.");
        //giustificare il for

        i=0;
        while(quantitaRimanente>0&&i<materiePrimeId[msg.sender]) //verificare da togliere il materiePrimeId
        {
                if(materia_prima[msg.sender][i].amount>quantitaRimanente){

                    materia_prima[msg.sender][i].amount-=quantitaRimanente;
                    quantitaRimanente=0;
                    
                    //if amount=0, emit lotto terminato

                }
                else{
                    quantitaRimanente-=materia_prima[msg.sender][i].amount;
                    materia_prima[msg.sender][i].amount=0;
                    materia_prima[msg.sender][i].not_available=true;
                    //aggiungere gli emit lotto terminato
                }
            i++;
        }


        // da aggiungere: ricavare l'impatto dal vecchio token e sommarlo al nuovo
        uint256 tokenId=tokenContract.safeMint(msg.sender,_impattoAmbientale);
        prodotti[msg.sender][prodottiId[msg.sender]]=Prodotti({
            id_prodotto:prodottiId[msg.sender],
            nome:_nome,
            owner:msg.sender,
            token:tokenId,
            amount:_quantitaRichiesta,
            not_available:false
        });
        emit materiaPrimaCreata(prodottiId[msg.sender],_nome,_quantitaRichiesta,_impattoAmbientale);
        incrementProdotti();
        
    }

    function getMateriaPrima(uint _idLotto) view public returns (MateriaPrima memory){
        require(_idLotto<=materiePrimeId[msg.sender],"Il lotto con ID richiesto non esiste.");
        return materia_prima[msg.sender][_idLotto];
    }
    function getProdotto(uint _idLotto) view public returns (Prodotti memory){
        require(_idLotto<=prodottiId[msg.sender],"Il lotto con ID richiesto non esiste.");
        return prodotti[msg.sender][_idLotto];
    }
    function getProdottoByAddress(address _address,uint256 _idLotto) view public returns (Prodotti memory){
        require(_idLotto<=prodottiId[_address],"Il lotto con ID richiesto non esiste.");
        return prodotti[_address][_idLotto];
    }   
    function getMateriaPrimaByAddress(address _address,uint256 _idLotto) view public returns (Prodotti memory){
        require(_idLotto<=prodottiId[_address],"Il lotto con ID richiesto non esiste.");
        return prodotti[_address][_idLotto];
    }   
}