const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const authRouter=require('./routes/auth')
const pagesRouter=require('./routes/pages')
const dotenv=require('dotenv')
const session=require('express-session')
const crypto=require('crypto')

const handlebars = require('express-handlebars').create({
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  defaultLayout: 'layout',
  extname: 'hbs'
});

dotenv.config({
  path:'./configs/.env'
})


app.engine('hbs', handlebars.engine)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, "views"))


var secret = crypto.randomBytes(32).toString('hex');
console.log(secret)

app.use(pagesRouter)
app.use(authRouter)


app.listen(5000, ()=>{
    console.log('Server is listening on port 5000')
})