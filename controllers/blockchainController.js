const { parse } = require('dotenv');
const Web3=require('web3')
const cfABI=require('../contracts/artifacts/CarbonFootprint.json')
const tABI=require('../contracts/artifacts/Transazione.json')
const session = require("./session");
const logController=require('./logController');
const { raw } = require('mysql');
const encrypter=require('./crypt');


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
const transactionsInstance=new web3.eth.Contract(tABI.abi, ADDRESS_T)
blockChainLogger.tokenLog("Connesso con successo allo smart contract Token.")
blockChainLogger.transactionLog("Connesso con successo allo smart contract transactions.")


exports.newAccount=async ()=>{
    try {
        var account=await web3.eth.personal.newAccount("", (err)=>{
            if(err){
                console.log(err);
                return res.render('home',{
                    layout:'index',
                    message:'Transaction not executed.'
                })
            }
        })
        await this.unlockAccount(account,"")
        blockChainLogger.blockchain("Account "+account+" created successfully.")
        await carbonFootprintInstance.methods.setApprovalForAll(ADDRESS_T,true).send({
            from:account,
            gasPrice: web3.utils.toHex(0),
            gasLimit: web3.utils.toHex(5000000)
        });
        return account
    } catch (error) {
        console.log(error)
        blockChainLogger.error(error)
        return false
    }
    //TODO aggiungere codice per log tracciamento nuovo account
}

exports.unlockAccount=async(account,password)=>{
        await web3.eth.personal.unlockAccount(account,password, 600)
        .then(console.log('Account unlocked!'));
}

exports.goToNewRawMaterial = async (req, res) => {
    await this.getListOwnRawMaterials(req)
    res.redirect("/newrawmaterial")
}
/*
exports.goToNewProduct = async (req, res) => {
    await this.getListOwnProducts(req)
    //authController.getAllProductsByType(req)
    res.redirect("/newproduct")
}*/

exports.getListOwnRawMaterials = async (req) => {
    var walletAddress = await encrypter.decrypt(session.getProfile(req).wallet_address.toString())
    var limit = await transactionsInstance.methods.getRawMaterialsId().call()
    var rawMaterials = []
    for (var i = 0; i < limit; i++){
        var rawMaterial = await this.getRawMaterial(walletAddress,i)
        if(!rawMaterial){
        }else{
            var carbonfootprint=await this.getCarbonFootprint(rawMaterial.token)
            if(rawMaterial.amount>0 && rawMaterial.name!=""){
                rawMaterials.push({
                    "idLotto":rawMaterial.id_raw_material, 
                    "name":rawMaterial.name,
                    "amount":rawMaterial.amount,
                    "carbonfootprint":carbonfootprint
                })
            } 
        }
    } 
    session.setListOwnRawMaterial(req, rawMaterials)    
}

 
exports.getListOwnProducts= async (req) => {
    var walletAddress = session.getProfile(req).wallet_address
    var decryptedAddress=await encrypter.decrypt(walletAddress.toString())
    var limit = await transactionsInstance.methods.getProductsId().call()
    var products = []
    for (var i = 0; i < limit; i++){
        var product = await this.getProduct(decryptedAddress,i)
        if(!product){
        }else{
            var carbonfootprint=await this.getCarbonFootprint(product.token)
            var usedRawMaterials = []
            var j = 0
            /*var flag=true
            while(flag){
                if((product.usedRawMaterials[j]==0 && j!=0) || j==20){
                    flag = false
                }else{                
                    usedRawMaterials.push(product.usedRawMaterials[j])
                    j++
                }
            }*/
            for(var j=0;j<20;j++){
                if(product.usedRawMaterials[j]==0 && j!=0)
                    break;
                else
                    usedRawMaterials.push(product.usedRawMaterials[j])
            }
            if(product.amount>0 && product.name!=""){
                products.push({
                    "idLotto":product.id_product, 
                    "name":product.name,
                    "amount":product.amount,
                    "carbonfootprint":carbonfootprint,
                    "usedRawMaterials":usedRawMaterials
                })
            } 
        }
    } 
    session.setListOwnProducts(req, products)
}

exports.getListRawMaterialsByOwner = async (req, res)=>{
    const{selectWA} = req.body;
    var decryptedAddress=encrypter.decrypt(selectWA.toString())
    var limit = await transactionsInstance.methods.getRawMaterialsId().call()
    //var selectWA = "0x17BE7A41e13e89cc86a4cd445233Fb83351dd506"
    
    var rawMaterials = []
    for (var i = 0; i < limit; i++){
        var rawMaterial = await this.getRawMaterial(decryptedAddress,i)
        if(!rawMaterial){
        }else{ 
            var carbonfootprint=await this.getCarbonFootprint(rawMaterial.token)
            if(rawMaterial.amount>0 && rawMaterial.name!=""){
                rawMaterials.push({
                    "idLotto":rawMaterial.id_raw_material, 
                    "name":rawMaterial.name,
                    "amount":rawMaterial.amount,
                    "owner":selectWA,
                    "carbonfootprint":carbonfootprint
                }) 
            } 
        } 
    } 
    session.setListRawMaterial(req, rawMaterials)
    res.redirect("/listrawmaterials")
}

exports.getListProductsByOwner  = async (req, res) => {
    const{selectWA} = req.body;
    var limit = await transactionsInstance.methods.getProductsId().call()
    var decryptedAddress=await encrypter.decrypt(selectWA.toString())
    
    var products = []
    for (var i = 0; i < limit; i++){
        var product = await this.getProduct(decryptedAddress,i)
        if(!product){
        }else{ 
            var carbonfootprint=await this.getCarbonFootprint(product.token)
            var usedRawMaterials = []
            var j = 0
            for(var j=0;j<20;j++){
                if(product.usedRawMaterials[j]==0 && j!=0)
                    break;
                else
                    usedRawMaterials.push(product.usedRawMaterials[j])
            }
            if(product.amount>0 && product.name!=""){
                products.push({
                    "idLotto":product.id_product, 
                    "name":product.name,
                    "amount":product.amount,
                    "owner":selectWA,
                    "carbonfootprint":carbonfootprint,
                    "usedRawMaterials":usedRawMaterials
                }) 
            } 
        } 
    } 
    session.setListProducts(req, products)
    res.redirect("/listproducts")
}

/*
*   Acquisto di una nuova materia prima
*   Si richiama la funzione nel contratto relativa all'acquisto della materia prima
*
*
*/

exports.buyRawMaterial=async (req,res)=>{
    var user_wallet=session.getProfile(req).wallet_address
    var decryptedBuyerAddress=await encrypter.decrypt(user_wallet.toString())
    const{
        _walletProduttore,
        _lottoScelto,
    }=req.body;
    var decrypterSellerAddress=await encrypter.decrypt(_walletProduttore.toString())
    try{
        await transactionsInstance.methods.buyRawMaterial(decrypterSellerAddress, decryptedBuyerAddress ,_lottoScelto ).send({
                    from: decryptedBuyerAddress, 
                    gasPrice: web3.utils.toHex(0), 
                    gasLimit: web3.utils.toHex(5000000)
                })
                session.setSuccess(req,"Purchase completed!")
                blockChainLogger.transactionLog("User:"+decryptedBuyerAddress+" has successfully purchased the lot n° "+_lottoScelto+" form the supplier:"+decrypterSellerAddress)
                await this.getListOwnRawMaterials(req)
                session.setListRawMaterial(req, new Array(0))
                res.redirect('/listrawmaterials')
    }
    catch(error){
        console.log(error)
        blockChainLogger.error(error)
    }
}


/*
*   Acquisto di un nuovo prodotto
*   Si richiama la funzione nel contratto relativa all'acquisto di un nuovo prodotto
*
*
*/

exports.buyProduct=async (req,res)=>{
    var user_wallet=session.getProfile(req).wallet_address
    var decryptedBuyerAddress=await encrypter.decrypt(user_wallet.toString())
    const{
        _walletProduttore,
        _lottoScelto,
    }=req.body;
    var decrypterSellerAddress=await encrypter.decrypt(_walletProduttore.toString())
    try{
        await transactionsInstance.methods.buyProduct(decrypterSellerAddress, decryptedBuyerAddress,_lottoScelto ).send({
                    from: decryptedBuyerAddress, 
                    gasPrice: web3.utils.toHex(0), 
                    gasLimit: web3.utils.toHex(5000000)
                })
                session.setSuccess(req,"Purchase completed successfully!")
                blockChainLogger.transactionLog("User:"+user_wallet+" has successfully purchased the lot n° "+_lottoScelto+" form the seller:"+_walletProduttore)
                await this.getListOwnProducts(req)
                session.setListProducts(req, new Array(0))
                res.redirect('/listproducts')
    }
    catch(error){
        console.log(error)
        blockChainLogger.error(error)
    }
}

/*
*   Creazione di una nuova materia prima
*   Si richiama la funzione nel contratto relativa alla creazione della materia prima
*
*/
exports.createNewRawMaterial=async (req, res)=>{
    const {
        amount,
        carbfoot
    } = req.body;
    var amountValue = parseInt(amount)
    var carbfootValue = parseInt(carbfoot)
    var name=session.getProfile(req).type;
    if ((amountValue>0 && amountValue<100)&&(carbfootValue>0 && carbfootValue<1000)){ 
        try{
            var user = session.getProfile(req)
            var decryptedAddress=await encrypter.decrypt(user.wallet_address.toString())
            await transactionsInstance.methods.createNewRawMaterial(name, amountValue, carbfootValue).send({
                from: decryptedAddress, 
                gasPrice: web3.utils.toHex(0), 
                gasLimit: web3.utils.toHex(5000000)
            })
            session.setSuccess(req, "New raw material added to blockchain");
            await this.getListOwnRawMaterials(req)

        } catch (error) {
            console.log(error);
            session.setError(req, "Errore Sconosciuto");
        }  
    }else {
        session.setError(req, "Controlla i Campi.");
    } 
    //typeof == 'number'
    res.redirect("/newrawmaterial");
}

/*
*   Creazione di un nuovo prodotto
*   Si richiama la funzione nel contratto relativa alla creazione del nuovo lotto di prodotti
*   Si passano il numero di prodotti richiesti, ed il numero di materie prime necessarie per la creazione dei suddetti prodotti
*
*/

exports.createNewProduct= async (req, res)=>{
    const {
        name,
        amount,
        carbfoot,
    } = req.body;
    var values = name.split(",")
    var productName=values[1];
    var requiredRawMaterialAmount=values[0];
    var requiredProductAmount = parseInt(amount)
    var carbfootValue = parseInt(carbfoot)
    if ((typeof values[1] == 'string' && values[1] != "")&&(requiredProductAmount>0 && requiredProductAmount<100)&&(carbfootValue>0 && carbfootValue<1000)){ 
        try{
            var user = session.getProfile(req)
            var decryptedAddress=await encrypter.decrypt(user.wallet_address.toString())
            await transactionsInstance.methods.createNewProduct(productName, requiredProductAmount, requiredRawMaterialAmount*requiredProductAmount, carbfootValue).send({
                from: decryptedAddress, 
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
        session.setError(req, "Controlla i Campi.");
    } 
    res.redirect("/newproduct");
    
}
/*
*   Funzione per la ricerca di un lotto di materie prime a partire dal lottoID e dal wallet
*
*/
exports.getRawMaterial = async (wallet, idLotto)=>{
    try{
        var response = await transactionsInstance.methods.getRawMaterialByAddress(wallet, idLotto).call()
        return response
    }catch(error){
        console.log(error)
        return false
    } 
} 


/*
*   Funzione per la ricerca di un carbon footprint value a partire dal tokenID
*
*/
exports.getCarbonFootprint=async(token_id)=>{
    try{
        var response=await carbonFootprintInstance.methods.getCarbonFootprint(token_id).call()
        return response;

    }catch(error){
        blockChainLogger.error(error)
        console.log(error)
        return -1
    }
}


/*
*   Funzione per la ricerca di un lotto di prodotti a partire dal lottoID e dal wallet
*
*/
exports.getProduct = async(wallet, idLotto)=>{
    try{
        var response=await transactionsInstance.methods.getProductByAddress(wallet, idLotto).call()
        return response 
    }catch(error){
        console.log(error)
        return false
    } 
}

/*

EVENT LISTENERS

Intercettazione e log degli eventi che la blockchain emette


*/

var eventMateriaPrimaCreata = transactionsInstance.events.materiaPrimaCreata({},
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
          eventObj.returnValues._nome +
          " QUANTITA': " +
          eventObj.returnValues._quantita+
          " IMPATTO AMBIENTALE: "+
          eventObj.returnValues._impatto
        );
      }
    }
  );

  var eventProdottoCreato = transactionsInstance.events.prodottoCreato({},
    (error, eventObj) => {
      if (error) {
        blockChainLogger.error(error)
      }
      if (eventObj) {
        console.log(eventObj.returnValues)
        blockChainLogger.transactionLog(
          "PRODOTTO CREATO: " +
          eventObj.event +
          " \t| LOTTOID: " +
          eventObj.returnValues._idLotto +
          " NOME: " +
          eventObj.returnValues._nome +
          " QUANTITA': " +
          eventObj.returnValues._quantita+
          " IMPATTO AMBIENTALE: "+
          eventObj.returnValues._impatto
        );
      }
    }
  );

  var eventLottoTerminato = transactionsInstance.events.lottoTerminato({},
    (error, eventObj) => {
      if (error) {
        blockChainLogger.error(error)
      }
      if (eventObj) {
        console.log(eventObj.returnValues)
        blockChainLogger.transactionLog(
          "LOTTO TERMINATO: " +
          eventObj.event +
          " \t| LOTTOID: " +
          eventObj.returnValues._idLotto +
          " NOME: " +
          eventObj.returnValues._nome 
        );
      }
    }
  );