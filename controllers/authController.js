const mysql = require("mysql");
const bcrypt = require("bcrypt");
const blockchainController = require("./blockchainController");
const session = require("./session");
const { NULL } = require("mysql/lib/protocol/constants/types");
const logController=require('./logController');
const { query } = require("express");
const encrypter=require('./crypt')

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
  
  var regularExpression = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,32}$/;

  if(!regularExpression.test(password))
  {
    session.setError(req,"La password non rispetta i requisiti di sicurezza minimi!")
    return res.redirect("/register")
  };
  
  var time = Date.now();
  var user;
  const { email, password,tentativo } = req.body;

  numTentativo=Number(tentativo);

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
              logger.error(req,"Enter incorrect credentials for the user:"+email)
              res.redirect("/login");
              return
          }else{
            if(results[0].locked_date>time - 600 * 1000)
            {
              console.log("prova")
              session.setError(req,"Account Temporaneamente bloccato, puoi riprovare tra:"+String(-Math.trunc(((time-600*1000)-results[0].locked_date)/1000/60))+" minuti.")
              console.log(req.session.error)
              res.redirect("/login")
              return
            }
            if (error) throw error;
            let comparison = await bcrypt.compare(
              password,
              results[0].password
            );
            if (comparison) {
              session.setLogged(req, true);
              user={
                email:results[0].email,
                wallet_address: results[0].wallet_address,
                name:results[0].name,
                surname:results[0].surname,
                role:results[0].role,
                type:results[0].type
              }
              await blockchainController.unlockAccount(await encrypter.decrypt(user.wallet_address.toString()),"")
              session.setProfile(req,user)
              session.setRole(req,user.role)
              console.log(session.getProfile(req))
              session.setSuccess(req, "Login successful!");
              logger.action(user.wallet_address+" logged in successfully.")
              executeQuery(
                "UPDATE users SET locked_date = 0,login_attempts = 0 WHERE email = ?",
                 [time,email],
                 function (error, results, fields) {
                  if (error) {
                    logger.error(error.message);
                  }
                }
              )
              res.redirect("/");
            } else {
              session.setError(req,"Wrong credentials!")
              logger.error("Enter incorrect credentials for the user:"+email)
              console.log(results[0].login_attempts)
              if(results[0].login_attempts>4)
              {
                console.log(time)
                executeQuery(
                  "UPDATE users SET locked_date = ?,login_attempts = 0 WHERE email = ?",
                   [time,email],
                   function (error, results, fields) {
                    if (error) {
                      logger.error(error.message);
                    }
                  }
                )
                session.setError(req,"Account Bloccato per 10 minuti.")
                res.redirect("/login")
              }
              else{
                executeQuery(
                  "UPDATE users SET login_attempts = ? WHERE email = ?",
                  [results[0].login_attempts+1,email],
                  function (error, results, fields) {
                    if (error) {
                      logger.error(error.message);
                    }
                  }
                )
                res.redirect("/login");
              }
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
  var query;
  const {
    name,
    surname,
    email,
    password,
    confpassword,
    role,
    type
  } = req.body;
  if (!validPassword(password, confpassword) || (password =="")){
    session.setError(req, "Password vuota o non combaciante.");
    res.redirect("/register");
  }
  else if(role =="Customer" && type != "")
  {
    session.setError(req, "Il cliente non necessità di una categoria. Lascia il campo 'Tipologia' vuoto");
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
          var encryptedAddress = await encrypter.encrypt(newAccount)
          console.log("indirizzo originale:"+newAccount)
          console.log("prova crittazione:"+encryptedAddress.toString())
          if(role=="Customer"){
          executeQuery(
            "INSERT INTO users (email, password, wallet_address, name, surname, role) VALUES (?, ?, ?, ?, ?, ?)",
            [email, hashed, encryptedAddress.toString(), name, surname, role, type],
            function (error, results) {
              if (error) throw error;
              req.session.success = true;
              session.setSuccess(req, "Account aggiunto con Successo!");
              logger.action(newAccount+" Successfully registered. "+"Account type:"+role+" | Type of products:"+type)
              res.redirect("/login");
            }
          )} 
          else {
            executeQuery(
              "INSERT INTO users (email, password, wallet_address, name, surname, role, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [email, hashed, encryptedAddress.toString(), name, surname, role, type],
              function (error, results) {
                if (error) throw error;
                req.session.success = true;
                session.setSuccess(req, "Account aggiunto con Successo!");
                logger.action(newAccount+" Successfully registered. "+"Account type:"+role+" | Type of products:"+type)
                console.log("prova decrittazione"+encrypter.decrypt(encryptedAddress))
                res.redirect("/login");
              }
            )            
          }
        } else {
          logger.action("User input credentials already existing.")
          session.setWarning(req, "Account già esistente!");
          res.redirect("/register");
        }
      }
    );
  }
};

