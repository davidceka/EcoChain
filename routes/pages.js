const express=require('express');
const { home } = require('nodemon/lib/utils');
const router=express.Router()

router.get('/',(req,res)=>{
    var isLogged = req.session.isLogged;
    res.render('home',{
        layout:'index',
        isLogged:isLogged
    })
})
router.get('/chisiamo',(req,res)=>{
    res.render('chisiamo',{
        layout:'index'
    })
})
router.get('/login',(req,res)=>{
    res.render('login',{
        layout:'index'
    })
})




module.exports=router;