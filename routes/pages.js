const express=require('express');
const router=express.Router()
const blockchainController=require('../controllers/blockchainController')
const session=require('../controllers/session')


router.get('/',(req,res)=>{
    res.render('home',{
        layout:'index',
        isLogged:req.session.isLogged,
        isWorker:req.session.isWorker,
        isProducer:req.session.isProducer,
        success:req.session.success,
        error:req.session.error,
        message:req.session.message
    })
    session.clearNotifications(req)
})
router.get('/chisiamo',(req,res)=>{
    res.render('chisiamo',{
        layout:'index',
        isLogged:req.session.isLogged
    })
})
router.get('/login',(req,res)=>{
    res.render('login',{
        layout:'index',        
        success:req.session.success,
        message:req.session.message
    })
    session.clearNotifications(req)
})

router.get('/register',(req,res)=>{
    res.render('register',{
        layout:'index',
        error:req.session.error,
        warning:req.session.warning,
        message:req.session.message
    })
    session.clearNotifications(req);
    
    
})

router.get('/newrawmaterial',(req,res)=>{
    var isLogged=req.session.isLogged;
    if(isLogged){
        res.render('newrawmaterial',{
            layout:'index',
            error:req.session.error,
            success:req.session.success,
            message:req.session.message,
            isLogged:isLogged
        })
        session.clearNotifications(req);
    }
    else
    res.redirect('/')
})
router.get('/newproduct',(req,res)=>{
    var isLogged=req.session.isLogged;
    if(isLogged)
    res.render('newproduct',{
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
router.get('/profilo',(req,res)=>{
    
    if(req.session.isLogged){
        user=session.getProfile(req)
        res.render('profilo',{
            layout:'index',
            isLogged:req.session.isLogged,
            email:user.email,
            nome:user.nome,
            cognome:user.cognome,
            ruolo:user.ruolo,
            wallet_address:user.wallet_address
        })
    }else{
        session.setError(req,'Devi effettuare il login per accedere a questa pagina.')
        console.log(req.session.message)
        console.log(req.session.error)
        res.redirect('/')
    }
})
router.get('/nuovoaccount',blockchainController.newAccount)


module.exports=router;