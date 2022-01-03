const mysql=require('mysql')
var conn=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
})

exports.login = (req,res)=>{
    
    var isLogged=false;
    const {
        email,
        password
    }=req.body;
    
    isLogged=true;
    req.session.isLogged = isLogged;
    console.log(req.session)
    res.redirect('/');

}
exports.logout=(req,res)=>{
    if (req.session.isLogged == true) {
        req.session.destroy();
        res.redirect('/')
      } else {
        res.redirect('/')
      }
}
