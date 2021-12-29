var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);

var handlebars = require('express-handlebars').create({
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  defaultLayout: 'layout',
  extname: 'hbs'
});

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));

app.use(require('./routes/pages'));
app.use(require('./routes/auth'))

app.listen(5000, ()=>{
    console.log('Server is listening on port 5000')
})