const express=require('express')
const app=express()



app.set('view engine','hbs');

app.use(express.urlencoded({
    extended:false
}))


app.use('/',require('./routes/pages'))

app.listen(5000, ()=>{
    console.log('Server is listening on port 5000')
})