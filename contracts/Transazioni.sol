// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./CarbonFootprint.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Transazione {
    address tokenContractAddress;
    CarbonFootprint tokenContract;

    /*uint256 prodottiId;
    uint256 materiePrimeId;*/

    //possibile errore quando si vendono i prodotti/materie
    uint256 prodottiId;
    uint256 materiePrimeId;

    constructor (address _tokenContractAddress){
        tokenContractAddress=_tokenContractAddress;
        tokenContract=CarbonFootprint(tokenContractAddress);
    }

    //emit ed eventi da aggiungere
    event materiaPrimaCreata(uint256 _idLotto,string nome,uint256 _amount,uint256 _impatto);
    event prodottoCreato(uint256 _idLotto,string nome,uint256 _amount,uint256 _impatto);
    event lottoTerminato(uint256 _idLotto);
    event quantitaSufficiente(bool status);

    function incrementMaterie() internal{
        materiePrimeId++;
    }
    function incrementProdotti() internal{
        prodottiId++;
    }

    function getMateriePrimeId() view public returns(uint256){
        return materiePrimeId;
    }

    function getProdottiId() view public returns(uint256){
        return prodottiId;
    }

    struct MateriaPrima{
        uint256 id_lottomateria;
        string nome;
        uint256 token;  
        uint256 amount;  
        bool not_available;
    }


    struct Prodotti{
        uint256 id_prodotto;
        string nome;
        uint256 token;
        uint256 amount;
        bool not_available;

    }

    mapping(address=>mapping(uint256=>Prodotti)) prodotti;
    mapping(address=> mapping(uint256=>MateriaPrima)) materia_prima;

    function creaNuovaMateriaPrima(string memory _nome,uint256 _amount, uint256 _impattoAmbientale) public{
        uint256 tokenId=tokenContract.safeMint(msg.sender,_impattoAmbientale);
        materia_prima[msg.sender][materiePrimeId]=MateriaPrima({
            id_lottomateria:materiePrimeId,
            nome:_nome,
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
            if(!materia_prima[msg.sender][i].not_available){
                quantitaDisponibile+=materia_prima[msg.sender][i].amount;
                i++;
            }
        }
        //emit la quantità è sufficiente, la transazione procede
        emit quantitaSufficiente(true);
        require(quantitaDisponibile>=_quantitaRichiesta,"Quantita di materia prima non sufficiente.");
        //giustificare il for

        i=0;
        while(quantitaRimanente>0&&i<materiePrimeId) //verificare da togliere il materiePrimeId
        {
                if(materia_prima[msg.sender][i].amount>quantitaRimanente){

                    materia_prima[msg.sender][i].amount-=quantitaRimanente;
                    quantitaRimanente=0;
                    if(materia_prima[msg.sender][i].amount==0){
                        //emit lottoTerminato(string(abi.encodePacked("Il lotto numero ",Strings.toString(i)," e' terminato.")));
                        emit lottoTerminato(i);
                    }
                }
                else{
                    quantitaRimanente-=materia_prima[msg.sender][i].amount;
                    materia_prima[msg.sender][i].amount=0;
                    materia_prima[msg.sender][i].not_available=true;
                    //emit lottoTerminato(string(abi.encodePacked("Il lotto numero ",Strings.toString(i)," e' terminato.")));
                    emit lottoTerminato(i);
                }
            i++;
        }


        // da aggiungere: ricavare l'impatto dal vecchio token e sommarlo al nuovo
        uint256 tokenId=tokenContract.safeMint(msg.sender,_impattoAmbientale);
        prodotti[msg.sender][prodottiId]=Prodotti({
            id_prodotto:prodottiId,
            nome:_nome,
            token:tokenId,
            amount:_quantitaRichiesta,
            not_available:false
        });
        emit prodottoCreato(prodottiId,_nome,_quantitaRichiesta,_impattoAmbientale);
        incrementProdotti();
        
    }

    function acquistoMateriaPrima(address seller, address buyer,uint256 _idLotto) public {
        materia_prima[buyer][_idLotto]=materia_prima[seller][_idLotto];
        tokenContract.safeTransferFrom(seller,buyer,materia_prima[buyer][_idLotto].token);
        delete materia_prima[seller][_idLotto];
    }

    function getMateriaPrima(uint _idLotto) view public returns (MateriaPrima memory){
        require(_idLotto<=materiePrimeId,"Il lotto con ID richiesto non esiste.");
        return materia_prima[msg.sender][_idLotto];
    }
    function getProdotto(uint _idLotto) view public returns (Prodotti memory){
        require(_idLotto<=prodottiId,"Il lotto con ID richiesto non esiste.");
        return prodotti[msg.sender][_idLotto];
    }
    function getProdottoByAddress(address _address,uint256 _idLotto) view public returns (Prodotti memory){
        require(_idLotto<=prodottiId,"Il lotto con ID richiesto non esiste.");
        return prodotti[_address][_idLotto];
    }   
    function getMateriaPrimaByAddress(address _address,uint256 _idLotto) view public returns (MateriaPrima memory){
        require(_idLotto<=materiePrimeId,"Il lotto con ID richiesto non esiste.");
        return materia_prima[_address][_idLotto];
    }   
}