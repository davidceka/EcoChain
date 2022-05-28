const cryptojs=require('crypto-js');

const secret=process.env.SECRET;

exports.encrypt=(toEncryptString)=>{

    try{
    var hash=cryptojs.Rabbit.encrypt(toEncryptString,secret)
    return hash
    }
    catch(error){
        console.log("errore:"+error)
    }
}

exports.decrypt=(toDecryptString)=>{
    try {

        var decryptedString=cryptojs.Rabbit.decrypt(toDecryptString,secret).toString(cryptojs.enc.Utf8)
        return decryptedString;

    } catch (error) {

        return error;

    }
    

}