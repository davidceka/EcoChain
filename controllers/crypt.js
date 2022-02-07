const cryptojs=require('crypto-js');

const secret=process.env.SECRET;

exports.encrypt=(toEncryptString)=>{

    var hash=cryptojs.Rabbit.encrypt(toEncryptString,secret)
    return hash
}

exports.decrypt=(toDecryptString)=>{
    
    var decryptedString=cryptojs.Rabbit.decrypt(toDecryptString,secret).toString(cryptojs.enc.Utf8)

}