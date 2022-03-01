const mysql = require("mysql");
const bcrypt = require("bcrypt");
const blockchainController = require("./blockchainController");
const session = require("./session");
const { NULL } = require("mysql/lib/protocol/constants/types");
const logController=require('./logController')

logger=logController.actionLogger;

function defineConn() {
  var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  return conn;
}

async function hashPassword(password) {
  let hashed = await bcrypt.hash(password, 10);
  return hashed;
}

function validPassword(pass1, pass2) {
  //manca controllo su formato
  if (pass1 == pass2) {
    return true;
  } else {
    return false;
  }
}

async function executeQuery(query, params, callback) {
  conn = defineConn();
  conn.query(query, params, callback);
}

exports.login = (req, res) => {
  var user;
  const { email, password } = req.body;
  if ((password =="") || (email=="")){
    session.setError(req, "Incorrect fields entered");
    res.redirect("/login");
  }else{
      try{
        executeQuery(
          "SELECT * FROM users WHERE email = ?",
          [email],
          async function (error, results) {
          if (results.length == 0){
            session.setError(req,"Wrong credentials!")
              logger.error("Enter incorrect credentials for the user:"+email)
              res.redirect("/login");
          }else{
            if (error) throw error;
            let comparison = await bcrypt.compare(
              password,
              results[0].password
            );
            if (comparison) {
              session.setLogged(req, true);
              user={
                email:results[0].email,
                wallet_address:results[0].wallet_address,
                name:results[0].name,
                surname:results[0].surname,
                role:results[0].role,
                type:results[0].type
              }
              await blockchainController.unlockAccount(user.wallet_address,"")
              session.setProfile(req,user)
              session.setRole(req,user.role)
              console.log(session.getProfile(req))
              session.setSuccess(req, "Login successful!");
              logger.action(user.wallet_address+" logged in successfully.")
              res.redirect("/");
            } else {
              session.setError(req,"Wrong credentials!")
              logger.error("Enter incorrect credentials for the user:"+email)
              res.redirect("/login");
            }
          }
        }
      );
    }catch(error){
      console.log(error)
      logger.action(error)
    }
  }
};


exports.logout = (req, res) => {
  if (req.session.isLogged == true) {
    logger.action("User: "+session.getProfile(req).wallet_address+" is logging out.")
    req.session.destroy();
    res.redirect("/");
  } else {
    res.redirect("/");
  }
};

exports.register = async (req, res) => {
  const {
    name,
    surname,
    email,
    password,
    confpassword,
    role,
    type
  } = req.body;
  if (!validPassword(password, confpassword) || (password =="") || (role =="costumer" && type != "")){
    session.setError(req, "Incorrect fields entered");
    res.redirect("/register");
  }
  else{
    executeQuery(
      "SELECT name FROM users WHERE email = ?",
      [email],
      async function (error, results) {
        if (error) throw error;
        if (results.length == 0) {
          let hashed = await bcrypt.hash(password, 10);
          var newAccount = await blockchainController.newAccount();
          executeQuery(
            "INSERT INTO users (email, password, wallet_address, name, surname, role, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [email, hashed, newAccount, name, surname, role, type],
            function (error, results) {
              if (error) throw error;
              req.session.success = true;
              session.setSuccess(req, "Account added successfully!");
              logger.action(newAccount+" Successfully registered. "+"Account type:"+role+" | Type of products:"+type)
              res.redirect("/login");
            }
          ); 
        } else {
          logger.action("User input credentials already existing.")
          session.setWarning(req, "Account already present!");
          res.redirect("/register");
        }
      }
    );
  }
};

