const mysql = require('mysql');
const bcrypt = require('bcrypt');

function defineConn(){
    var conn = mysql.createConnection({
        host:process.env.DB_HOST,
        user:process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME,
    })
    return conn
}

async function hashPassword(password){
  let hashed = await bcrypt.hash(password, 10);
  return hashed;
}


function validPassword(pass1, pass2){
  //manca controllo su formato
  if(pass1 == pass2){return true}
  else{return false}
}

async function executeQuery(query, params, callback){
  conn = defineConn()
  conn.query(query, params, callback)
}

exports.login = (req,res)=>{
  var isLogged=false;
  const {
      email,
      password
  }=req.body;
  executeQuery('SELECT password FROM users WHERE email = ?', [email], async function(error, results){
    if(error) throw error;
    var control = await bcrypt.compareSync(password, results[0].password)
    if (control){
      isLogged=true;
      req.session.isLogged = isLogged;
      console.log(req.session)
      res.redirect('/');
    }else{
      res.redirect('/login')
    }
  })
}
exports.logout=(req,res)=>{
    if (req.session.isLogged == true) {
        req.session.destroy();
        res.redirect('/')
      } else {
        res.redirect('/')
      }
}

exports.register= async(req,res)=>{
  var isLogged=false;
  const {
      name,
      surname,
      email,
      password,
      confpassword
      //ruolo
  }=req.body
  if(validPassword(password, confpassword)){
    executeQuery("SELECT nome FROM users WHERE email = ?", [email], async function(error, results){
      if(error) throw error;
      if(results.length==0){
          console.log("registro")
          let hashed = await bcrypt.hash(password, 10);
          executeQuery("INSERT INTO users (email, password, wallet_address, nome, cognome, ruolo) VALUES (?, ?, ?, ?, ?, ?)", [email, hashed, 'qualcosa3', name, surname, 'cliente'],  function(error, results){
            if(error) throw error;
            console.log("dopo "+ hashed)
            res.redirect('/login')
          })
      }else{
        console.log("non nuovo")
        //redirect to register
      }
    })
  }
  //MAIL DI CONFERMA?
}

