const express=require('express')
var port=5000;

const app=express()


app.get('/',(req,res)=>{
    res.render("<h1>EcoChain</h1>")
})

app.listen(5000, ()=>{
    console.log('Server is listening on port '+port)
})