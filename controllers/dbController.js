
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const blockchainController = require("./blockchainController");
const session = require("./session");

function defineConn() {
  var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  return conn;
}
async function executeQuery(query, params, callback) {
  conn = defineConn();
  conn.query(query, params, callback);
}

exports.getAllProducers = async (req, res) => {
    var type = session.getProfile(req).tipologia
    executeQuery(
    "SELECT nome, cognome, wallet_address FROM users WHERE ruolo = 'produttore' AND tipologia = ?",
    [type],
    async function (error, results) {
      var producers = []//new Array(results.length)
      if (error) throw error;
      results.forEach(function (item){
        producers.push({
          nome:item.nome,
          cognome:item.cognome,
          walletAddress:item.wallet_address
        })
      })
      session.setListProducers(req, producers)
      await blockchainController.getListOwnRawMaterials(req)
      var selectedMaterials = new Array(0)
      session.setListRawMaterial(req, selectedMaterials)
      res.redirect("/listrawmaterials")
    })
  }  
  
  exports.getAllWorkers = async (req, res) => {
    executeQuery(
    "SELECT nome, cognome, wallet_address, tipologia FROM users WHERE ruolo = 'lavoratore'",
    [''],
    async function (error, results) {
      var workers = []
      if (error) throw error;
      results.forEach(function (item){
        workers.push({
          nome:item.nome,
          cognome:item.cognome,
          tipologia:item.tipologia,
          walletAddress:item.wallet_address
        })
      })
      session.setListWorkers(req, workers)
      await blockchainController.getListOwnProducts(req)
      var selectedProducts = new Array(0)
      session.setListProducts(req, selectedProducts)
      res.redirect("/listproducts")
    })
  } 
  
  exports.getAllProductsByType = async (req, res) => {
    var type = session.getProfile(req).tipologia
    executeQuery(
    "SELECT nome_prodotto, quantitaRichiesta FROM tipologie_prodotti WHERE tipologia = ?",
    [type],
    async function (error, results) {
      var productSelection = []
      if (error) throw error;
      results.forEach(function (item){
        productSelection.push({
          nome:item.nome_prodotto,
          quantitaRichiesta:item.quantitaRichiesta
        })
      })
      session.setListProductSelection(req, productSelection)
      await blockchainController.getListOwnProducts(req)
      res.redirect('/newproduct')
    })
  } 
  