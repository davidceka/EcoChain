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
  executeQuery(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async function (error, results) {
      if (error) throw error;
      var control = await bcrypt.compareSync(password, results[0].password);
      if (control) {
        session.setLogged(req, true);
        //console.log(req.session)
        user={
          email:results[0].email,
          wallet_address:results[0].wallet_address,
          nome:results[0].nome,
          cognome:results[0].cognome,
          ruolo:results[0].ruolo
        }
        session.setProfile(req,user)
        console.log(session.getProfile(req))
        session.setSuccess(req, "Login effettuato con successo!");
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    }
  );
};
exports.logout = (req, res) => {
  if (req.session.isLogged == true) {
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
    //ruolo
  } = req.body;
  if (validPassword(password, confpassword)) {
    executeQuery(
      "SELECT nome FROM users WHERE email = ?",
      [email],
      async function (error, results) {
        if (error) throw error;
        if (results.length == 0) {
          console.log("registro");
          let hashed = await bcrypt.hash(password, 10);
          var newAccount = await blockchainController.newAccount();
          executeQuery(
            "INSERT INTO users (email, password, wallet_address, nome, cognome, ruolo) VALUES (?, ?, ?, ?, ?, ?)",
            [email, hashed, newAccount, name, surname, "cliente"],
            function (error, results) {
              if (error) throw error;
              console.log("dopo " + hashed);
              req.session.success = true;
              session.setSuccess(req, "Account aggiunto con successo!");
              res.redirect("/login");
            }
          );
        } else {
          console.log("non nuovo");
          session.setWarning(req, "Account già presente!");
          res.redirect("/register");
        }
      }
    );
  } else {
    session.setError(req, "Password non combacianti");
    res.redirect("/register");
  }
};
