const path = require('path');
const express = require('express');
const app = express();
const dotenv=require('dotenv').config({
  path:'./configs/.env'
})
const authRouter=require('./routes/auth')
const pagesRouter=require('./routes/pages')
const dbdataRouter=require('./routes/dbdata')
const transactionsRouter=require('./routes/transactions')

const sessions=require('express-session')
const crypto=require('crypto')
const cookieParser=require('cookie-parser')

const handlebars = require('express-handlebars').create({
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  defaultLayout: 'layout',
  extname: 'hbs'
});



app.engine('hbs', handlebars.engine)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, "views"))


app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());



const singleSession = 1000 * 60 * 30;


var secret = crypto.randomBytes(32).toString('hex');
app.use(sessions({
  secret: secret,
  saveUninitialized: true,
  cookie: {
    maxAge: singleSession
  },
  resave: false
}));

app.use(cookieParser());

app.use('/',pagesRouter)
app.use('/auth',authRouter)
app.use('/transactions',transactionsRouter)
app.use('/dbdataRouter',dbdataRouter)



app.listen(5000, ()=>{
    console.log('Server is listening on port 5000')
})