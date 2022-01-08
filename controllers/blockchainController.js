const Web3=require('web3')
const tokenABI=require('../contracts/artifacts/CarbonFootprint.json')

var web3Provider = new Web3.providers.HttpProvider(process.env.QUORUM_N1);
var web3 = new Web3(web3Provider);
web3.eth.getBlockNumber().then((result) => {
  console.log("Latest Ethereum Block is ",result);
});

const ADDRESS_TOKEN=process.env.ADDRESS_TOKEN;
const carbonFootprintInstance=new web3.eth.Contract(tokenABI.abi, ADDRESS_TOKEN)



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
        await carbonFootprintInstance.methods.safeTransferFrom(to,from,token_id).send({
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