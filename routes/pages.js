const express=require('express');
const router=express.Router()
const blockchainController=require('../controllers/blockchainController')

router.get('/',(req,res)=>{
    res.render('home',{
        layout:'index',
        isLogged:req.session.isLogged
    })
})
router.get('/chisiamo',(req,res)=>{
    res.render('chisiamo',{
        layout:'index',
        isLogged:req.session.isLogged
    })
})
router.get('/login',(req,res)=>{
    res.render('login',{
        layout:'index'
    })
})

router.get('/register',(req,res)=>{
    res.render('register',{
        layout:'index'
    })
})

router.get('/pagina1',(req,res)=>{
    var isLogged=req.session.isLogged;
    if(isLogged)
    res.render('pagina1',{
        layout:'index',
        isLogged:isLogged
    })
    else
    res.redirect('/')
})
router.get('/pagina2',(req,res)=>{
    var isLogged=req.session.isLogged;
    if(isLogged)
    res.render('pagina2',{
        layout:'index',
        isLogged:isLogged
    })
    else
    res.redirect('/')
})
router.get('/pagina3',(req,res)=>{
    var isLogged=req.session.isLogged;
    if(isLogged)
    res.render('pagina3',{
        layout:'index',
        isLogged:isLogged
    })
    else
    res.redirect('/')
})
router.get('/nuovoaccount',blockchainController.newAccount)

module.exports=router;