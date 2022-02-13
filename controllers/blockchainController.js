const { parse } = require('dotenv');
const Web3=require('web3')
const cfABI=require('../contracts/artifacts/CarbonFootprint.json')
const tABI=require('../contracts/artifacts/Transazione.json')
const session = require("./session");
const logController=require('./logController');


const blockChainLogger=logController.blockchainLogger;
var web3Provider = new Web3.providers.WebsocketProvider(process.env.QUORUM_N1);
var web3 = new Web3(web3Provider);
web3.eth.getBlockNumber().then((result) => {
console.log("Latest Ethereum Block is ",result);
});

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
        blockchainLogger.blockchain("Account "+account+" creato con successo.")
        return account
    } catch (error) {
        console.log(error)
        blockchainLogger.error(error)
        return false
    }
    //TODO aggiungere codice per log tracciamento nuovo account
}

async function ownerOf(id_token){
    var response=await carbonFootprintInstance.methods.ownerOf(id_token).call()
    return response
}

async function safeMint(address){
    try{
        await carbonFootprintInstance.methods.safeMint(address).send({
            from:address,
            gasPrice: web3.utils.toHex(0),
            gasLimit: web3.utils.toHex(5000000)
        })
        return true
    }catch(error){
        console.log(error) 
        return false
    }
}

async function safeTransferFrom(from,to,token_id){
    try {
        await carbonFootprintInstance.methods.safeTransferFrom(from,to,token_id).send({
            from:from,
            gasPrice: web3.utils.toHex(0),
            gasLimit: web3.utils.toHex(5000000)
        
        });
        return true;
    } catch (error) {
        console.log(error)
        return false
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
        console.log("OK");
        try{
            var user = session.getProfile(req)
            console.log(transazioniInstance)
            await transazioniInstance.methods.creaNuovaMateriaPrima(name, amountValue, carbfootValue).send({
                from: user.wallet_address, 
                gasPrice: web3.utils.toHex(0), 
                gasLimit: web3.utils.toHex(5000000)
            })
            session.setSuccess(req, "New raw material added to blockchain");
            
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
    console.log("ciao")
}
  

exports.getMateriaPrima = async (idLotto)=>{
    try{
        var response=await transazioniInstance.methods.getMateriaPrima(idLotto).call()
        return response
    }catch(error){
        console.log(error)
        return false
    } 
} 

exports.getProdotto = async(idLotto)=>{
    try{
        var response=await transazioniInstance.methods.getProdotto(idLotto).call()
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
        blochChainLogger.error(error)
      }
      if (eventObj) {
        console.log(eventObj.returnValues)
        blochChainLogger.transactionLog(
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