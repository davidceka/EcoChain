// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./CarbonFootprint.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Transazione {
    address tokenContractAddress;
    CarbonFootprint tokenContract;


    uint256 productsId;
    uint256 rawMaterialsId;

    constructor (address _tokenContractAddress){
        tokenContractAddress=_tokenContractAddress;
        tokenContract=CarbonFootprint(tokenContractAddress);
    }

    //emit ed eventi da aggiungere
    event materiaPrimaCreata(uint256 _idLotto,string nome,uint256 _quantita,uint256 _impatto);
    event prodottoCreato(uint256 _idLotto,string _nome,uint256 _quantita,uint256 _impatto);
    event lottoTerminato(uint256 _idLotto,string _nome);
    event quantitaSufficiente(bool status);

    function incrementRawMaterials() internal{
           rawMaterialsId++;
    }
    function incrementProducts() internal{
        productsId++;
    }

    function getRawMaterialsId() view public returns(uint256){
        return rawMaterialsId;
    }

    function getProductsId() view public returns(uint256){
        return productsId;
    }

    struct RawMaterial{
        uint256 id_raw_material;
        string name;
        uint256 token;  
        uint256 amount;  
        bool not_available;
    }


    struct Product{
        uint256 id_product;
        string name;
        uint256 token;
        uint256 amount;
        bool not_available;
    }

    mapping(address=>mapping(uint256=>Product)) products;
    mapping(address=> mapping(uint256=>RawMaterial)) raw_materials;

    function createNewRawMaterial(string memory _name,uint256 _amount, uint256 _carbonFootprint) public{
        uint256 tokenId=tokenContract.safeMint(msg.sender,_carbonFootprint);
        raw_materials[msg.sender][rawMaterialsId]=RawMaterial({
            id_raw_material:rawMaterialsId,
            name:_name,
            token:tokenId,
            amount:_amount,
            not_available:false
        });
        emit materiaPrimaCreata(rawMaterialsId,_name,_amount,_carbonFootprint);
        incrementRawMaterials();
        
    }
    function createNewProduct(string memory _name,uint256 _requiredProductAmount,uint256 _requiredRawMaterials,uint256 _carbonFootprint) public {
        uint256 remainingAmount=_requiredRawMaterials;
        uint256 availableAmount=0;
        uint256 i=0;
        while(availableAmount<=_requiredRawMaterials&&i<rawMaterialsId)
        {
            if(!raw_materials[msg.sender][i].not_available){
                availableAmount+=raw_materials[msg.sender][i].amount;
            }
            i++;
        }
        //emit la quantità è sufficiente, la transazione procede
        emit quantitaSufficiente(true);
        require(availableAmount>=_requiredRawMaterials,"Quantita di materia prima non sufficiente.");
        //giustificare il for

        i=0;
        while(remainingAmount>0&&i<rawMaterialsId) //verificare da togliere il materiePrimeId
        {
            if(raw_materials[msg.sender][i].amount>remainingAmount){

                raw_materials[msg.sender][i].amount-=remainingAmount;
                remainingAmount=0;
                if(raw_materials[msg.sender][i].amount==0){
                    emit lottoTerminato(i,raw_materials[msg.sender][i].name);
                }
            }
            else{
                remainingAmount-=raw_materials[msg.sender][i].amount;
                raw_materials[msg.sender][i].amount=0;
                raw_materials[msg.sender][i].not_available=true;
                emit lottoTerminato(i,raw_materials[msg.sender][i].name);
            }
            i++;
        }
        // da aggiungere: ricavare l'impatto dal vecchio token e sommarlo al nuovo
        uint256 tokenId=tokenContract.safeMint(msg.sender,_carbonFootprint);
        products[msg.sender][productsId]=Product({
            id_product:productsId,
            name:_name,
            token:tokenId,
            amount:_requiredProductAmount,
            not_available:false
        });
        emit prodottoCreato(productsId,_name,_requiredProductAmount,_carbonFootprint);
        incrementProducts();
    }

    function buyRawMaterial(address seller, address buyer,uint256 _idLotto) public {
        raw_materials[buyer][_idLotto]=raw_materials[seller][_idLotto];
        tokenContract.safeTransferFrom(seller,buyer,raw_materials[buyer][_idLotto].token);
        delete raw_materials[seller][_idLotto];
    }

    function buyProduct(address seller, address buyer,uint256 _idLotto) public {
        products[buyer][_idLotto]=products[seller][_idLotto];
        tokenContract.safeTransferFrom(seller,buyer,products[buyer][_idLotto].token);
        delete products[seller][_idLotto];
    }

    function getRawMaterial(uint _idLotto) view public returns (RawMaterial memory){
        require(_idLotto<=rawMaterialsId,"Il lotto con ID richiesto non esiste.");
        return raw_materials[msg.sender][_idLotto];
    }
    function getProduct(uint _idLotto) view public returns (Product memory){
        require(_idLotto<=productsId,"Il lotto con ID richiesto non esiste.");
        return products[msg.sender][_idLotto];
    }
    function getProductByAddress(address _address,uint256 _idLotto) view public returns (Product memory){
        require(_idLotto<=productsId,"Il lotto con ID richiesto non esiste.");
        return products[_address][_idLotto];
    }   
    function getRawMaterialByAddress(address _address,uint256 _idLotto) view public returns (RawMaterial memory){
        require(_idLotto<=rawMaterialsId,"Il lotto con ID richiesto non esiste.");
        return raw_materials[_address][_idLotto];
    }   
}