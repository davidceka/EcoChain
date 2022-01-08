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
    console.log(req.session.success)
    res.render('login',{
        layout:'index',        
        success:req.session.success
    })
    clearNotifications(req)
})

router.get('/register',(req,res)=>{
    res.render('register',{
        layout:'index',
        error:req.session.error,
        warning:req.session.warning,
        message:req.session.message
    })
    clearNotifications(req)
    
    
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

function clearNotifications(req){
    req.session.message=null;
    req.session.warning=null;
    req.session.error=null;
}

module.exports=router;