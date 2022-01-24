const Web3=require('web3')
const cfABI=require('../contracts/artifacts/CarbonFootprint.json')
const tABI=require('../contracts/artifacts/Transazione.json')

var web3Provider = new Web3.providers.HttpProvider(process.env.QUORUM_N1);
var web3 = new Web3(web3Provider);
web3.eth.getBlockNumber().then((result) => {
  console.log("Latest Ethereum Block is ",result);
});

const ADDRESS_CF=process.env.ADDRESS_CF;
const ADDRESS_T=process.env.ADDRESS_T;
const carbonFootprintInstance=new web3.eth.Contract(cfABI.abi, ADDRESS_CF)
const transazioniInstance=new web3.eth.Contract(tABI.abi, ADDRESS_T)


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
        return account
    } catch (error) {
        console.log(error)
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

exports.creaNuovaMateriaPrima=async (address, nome, quantità, impattoAmbientale)=>{
    try{
        await transazioniInstance.methods.creaNuovaMateriaPrima(nome, quantità, impattoAmbientale).send({
            from:address,
            gasPrice: web3.utils.toHex(0),
            gasLimit: web3.utils.toHex(5000000)
        })
        return true;
    } catch (error) {
        console.log(error)
        return false
    }
}

exports.creaNuovoProdotto = async (address, nome, quantitaRichiesta, impattoAmbientale)=>{
    try{
        await transazioniInstance.methods.creaNuovoProdotto(nome, quantitaRichiesta, impattoAmbientale).send({
            from:address,
            gasPrice: web3.utils.toHex(0),
            gasLimit: web3.utils.toHex(5000000)
        })
        return true;
    } catch (error) {
        console.log(error)
        return false
    }
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
