const { parse } = require('dotenv');
const Web3=require('web3')
const cfABI=require('../contracts/artifacts/CarbonFootprint.json')
const tABI=require('../contracts/artifacts/Transazione.json')
const session = require("./session");
const logController=require('./logController');
const { raw } = require('mysql');


const blockChainLogger=logController.blockchainLogger;
var web3Provider = new Web3.providers.WebsocketProvider(process.env.QUORUM_N1);
var web3 = new Web3(web3Provider);
web3.eth.getBlockNumber().then((result) => {
console.log("Latest Ethereum Block is ",result);
});

web3.eth.handleRevert = true;

const ADDRESS_CF=process.env.ADDRESS_CF;
const ADDRESS_T=process.env.ADDRESS_T;
const carbonFootprintInstance=new web3.eth.Contract(cfABI.abi, ADDRESS_CF)
const transazioniInstance=new web3.eth.Contract(tABI.abi, ADDRESS_T)
blockChainLogger.tokenLog("Connesso con successo allo smart contract Token.")
blockChainLogger.transactionLog("Connesso con successo allo smart contract transazioni.")


exports.newAccount=async ()=>{
    try {
        var account=await web3.eth.personal.newAccount("", (err)=>{
            if(err){
                console.log(err);
                return res.render('home',{
                    layout:'index',
                    message:'Transazione non eseguita.'
                })
            }
        })
        blockChainLogger.blockchain("Account "+account+" creato con successo.")
        await web3.eth.personal.unlockAccount(account,"", 600)
        .then(console.log('Account unlocked!'));
        await carbonFootprintInstance.methods.setApprovalForAll(ADDRESS_T,true).send({
            from:account,
            gasPrice: web3.utils.toHex(0),
            gasLimit: web3.utils.toHex(5000000)
        });
        return account
    } catch (error) {
        console.log(error)
        blockchainLogger.error(error)
        return false
    }
    //TODO aggiungere codice per log tracciamento nuovo account
}

exports.goToNewRawMaterial = async (req, res) => {
    await this.getListOwnRawMaterials(req)
    res.redirect("/newrawmaterial")
}

exports.goToNewProduct = async (req, res) => {
    await this.getListOwnProducts(req)
    res.redirect("/newproduct")
}

exports.getListOwnRawMaterials = async (req) => {
    var walletAddress = session.getProfile(req).wallet_address
    var limit = await transazioniInstance.methods.getMateriePrimeId().call()
     
    var rawMaterials = []
    for (var i = 0; i < limit; i++){
        var rawMaterial = await this.getMateriaPrima(walletAddress,i)
        if(!rawMaterial){
        }else{
            console.log(rawMaterial.nome)
            var _impatto=await this.getImpattoAmbientale(rawMaterial.token)
            if(rawMaterial.amount>0 && rawMaterial.name!=""){
                rawMaterials.push({
                    "idLotto":rawMaterial.id_lottomateria, 
                    "nome":rawMaterial.nome,
                    "quantita":rawMaterial.amount,
                    "impatto":_impatto
                })
            } 
        }
    } 
    session.setListOwnRawMaterial(req, rawMaterials)    
}

 
exports.getListOwnProducts= async (req) => {
    var walletAddress = session.getProfile(req).wallet_address
    var limit = await transazioniInstance.methods.getProdottiId().call()
    console.log("LIMIT VALE")
    console.log(limit)
    var products = []
    for (var i = 0; i < limit; i++){
        var product = await this.getProdotto(walletAddress,i)
        if(!product){
        }else{
            var _impatto=await this.getImpattoAmbientale(product.token)
            if(product.amount>0 && product.name!=""){
                products.push({
                    "idLotto":product.id_prodotto, 
                    "nome":product.nome,
                    "quantita":product.amount,
                    "impatto":_impatto
                })
            } 
        }
    } 
    session.setListOwnProducts(req, products)
}


exports.getListRawMaterialsByOwner = async (req, res)=>{
    const{selectWA} = req.body;
    var limit = await transazioniInstance.methods.getMateriePrimeId().call()
    //var selectWA = "0x17BE7A41e13e89cc86a4cd445233Fb83351dd506"
    
    var rawMaterials = []
    for (var i = 0; i < limit; i++){
        var rawMaterial = await this.getMateriaPrima(selectWA,i)
        if(!rawMaterial){
        }else{ 
            var _impatto=await this.getImpattoAmbientale(rawMaterial.token)
            if(rawMaterial.amount>0 && rawMaterial.name!=""){
                rawMaterials.push({
                    "idLotto":rawMaterial.id_lottomateria, 
                    "nome":rawMaterial.nome,
                    "quantita":rawMaterial.amount,
                    "owner":selectWA,
                    "impatto":_impatto
                }) 
            } 
        } 
    } 
    session.setListRawMaterial(req, rawMaterials)
    res.redirect("/listrawmaterials")
}

exports.getListProductsByOwner  = async (req, res) => {
    const{selectWA} = req.body;
    var limit = await transazioniInstance.methods.getProdottiId().call()
    //var selectWA = "0x17BE7A41e13e89cc86a4cd445233Fb83351dd506"
    
    var products = []
    for (var i = 0; i < limit; i++){
        var product = await this.getProdotto(selectWA,i)
        if(!product){
        }else{ 
            var _impatto=await this.getImpattoAmbientale(product.token)
            if(product.amount>0 && product.name!=""){
                products.push({
                    "idLotto":product.id_prodotto, 
                    "nome":product.nome,
                    "quantita":product.amount,
                    "owner":selectWA,
                    "impatto":_impatto
                }) 
            } 
        } 
    } 
    session.setListProducts(req, products)
    res.redirect("/listproducts")
}


exports.acquistoMateriaPrima=async (req,res)=>{
    var user_wallet=session.getProfile(req).wallet_address
    const{
        _walletProduttore,
        _lottoScelto,
    }=req.body;
    try{
        await transazioniInstance.methods.acquistoMateriaPrima(_walletProduttore, user_wallet ,_lottoScelto ).send({
                    from: user_wallet, 
                    gasPrice: web3.utils.toHex(0), 
                    gasLimit: web3.utils.toHex(5000000)
                })
                session.setSuccess(req,"Acquisto eseguito con successo!")
                await this.getListOwnRawMaterials(req)
                session.setListRawMaterial(req, new Array(0))
                res.redirect('/listrawmaterials')
    }
    catch(error){
        console.log(error)
        blockChainLogger.error(error)
    }
}

exports.acquistoProdotto=async (req,res)=>{
    var user_wallet=session.getProfile(req).wallet_address
    const{
        _walletProduttore,
        _lottoScelto,
    }=req.body;
    try{
        console.log("ciao")
        await transazioniInstance.methods.acquistoProdotto(_walletProduttore, user_wallet,_lottoScelto ).send({
                    from: user_wallet, 
                    gasPrice: web3.utils.toHex(0), 
                    gasLimit: web3.utils.toHex(5000000)
                })
                session.setSuccess(req,"Acquisto eseguito con successo!")
                await this.getListOwnProducts(req)
                session.setListProducts(req, new Array(0))
                res.redirect('/listproducts')
    }
    catch(error){
        console.log(error)
        blockChainLogger.error(error)
    }
}

exports.creaNuovaMateriaPrima=async (req, res)=>{
    const {
        name,
        amount,
        carbfoot
    } = req.body;
    var amountValue = parseInt(amount)
    var carbfootValue = parseInt(carbfoot)
    if ((typeof name == 'string' && name != "")&&(amountValue>0 && amountValue<100)&&(carbfootValue>0 && carbfootValue<100)){ 
        try{
            var user = session.getProfile(req)
            await transazioniInstance.methods.creaNuovaMateriaPrima(name, amountValue, carbfootValue).send({
                from: user.wallet_address, 
                gasPrice: web3.utils.toHex(0), 
                gasLimit: web3.utils.toHex(5000000)
            })
            session.setSuccess(req, "New raw material added to blockchain");
            await this.getListOwnRawMaterials(req)

        } catch (error) {
            console.log(error);
            session.setError(req, "Unknown Error");
        }  
    }else {
        console.log("NOT OK")
        session.setError(req, "Check input fields");
    } 
    //typeof == 'number'
    res.redirect("/newrawmaterial");
    
}

exports.creaNuovoProdotto=async (req, res)=>{
    const {
        name,
        amount,
        carbfoot
    } = req.body;
    var amountValue = parseInt(amount)
    var carbfootValue = parseInt(carbfoot)
    if ((typeof name == 'string' && name != "")&&(amountValue>0 && amountValue<100)&&(carbfootValue>0 && carbfootValue<100)){ 
        try{
            var user = session.getProfile(req)
            await transazioniInstance.methods.creaNuovoProdotto(name, amountValue, carbfootValue).send({
                from: user.wallet_address, 
                gasPrice: web3.utils.toHex(0), 
                gasLimit: web3.utils.toHex(5000000)
            })
            session.setSuccess(req, "New product added to blockchain");
            await this.getListOwnProducts(req)
             
        } catch (error) {
            console.log(error.reason);
            session.setError(req, error.reason);
        }  
    }else {
        console.log("NOT OK")
        session.setError(req, "Check input fields");
    } 
    res.redirect("/newproduct");
    
}

exports.getMateriaPrima = async (wallet, idLotto)=>{
    try{
        var response = await transazioniInstance.methods.getMateriaPrimaByAddress(wallet, idLotto).call()
        return response
    }catch(error){
        console.log("QUIIIIIIIIIIIIIIIIIIIIII " +error)
        return false
    } 
} 

exports.getImpattoAmbientale=async(token_id)=>{
    try{
        var response=await carbonFootprintInstance.methods.getImpattoAmbientale(token_id).call()
        return response;

    }catch(error){
        blockChainLogger.error(error)
        console.log(error)
        return -1
    }
}

exports.getProdotto = async(wallet, idLotto)=>{
    try{
        var response=await transazioniInstance.methods.getProdottoByAddress(wallet, idLotto).call()
        return response 
    }catch(error){
        console.log(error)
        return false
    } 
}

/*

EVENT LISTENERS



*/

var materiaprima_creata = transazioniInstance.events.materiaPrimaCreata({},
    (error, eventObj) => {
      if (error) {
        blockChainLogger.error(error)
      }
      if (eventObj) {
        console.log(eventObj.returnValues)
        blockChainLogger.transactionLog(
          "MATERIA PRIMA CREATA: " +
          eventObj.event +
          " \t| LOTTOID: " +
          eventObj.returnValues._idLotto +
          " NOME: " +
          eventObj.returnValues.nome +
          " QUANTITA': " +
          eventObj.returnValues._amount+
          " IMPATTO AMBIENTALE: "+
          eventObj.returnValues._impatto
        );
      }
    }
  );