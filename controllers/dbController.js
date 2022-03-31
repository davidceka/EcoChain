
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
  var type = session.getProfile(req).type
  executeQuery(
  "SELECT name, surname, wallet_address FROM users WHERE role = 'producer' AND type = ?",
  [type],
  async function (error, results) {
    var producers = []//new Array(results.length)
    if (error) throw error;
    results.forEach(function (item){
      producers.push({
        name:item.name,
        surname:item.surname,
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
"SELECT name, surname, wallet_address, type FROM users WHERE role = 'worker'",
[''],
async function (error, results) {
  var workers = []
  if (error) throw error;
  results.forEach(function (item){
    workers.push({
      name:item.name,
      surname:item.surname,
      type:item.type,
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
var type = session.getProfile(req).type
console.log(type)
executeQuery(
"SELECT product_name, required_amount FROM products_type WHERE type = ?",
[type],
async function (error, results) {
  var productSelection = []
  if (error) throw error;
  results.forEach(function (item){
    productSelection.push({
      product_name:item.product_name,
      required_amount:item.required_amount
    })
  })
  session.setListProductSelection(req, productSelection)
  await blockchainController.getListOwnProducts(req)
  res.redirect('/newproduct')
})
} 
