const express=require('express');
const { raw } = require('mysql');
const router=express.Router()
const blockchainController=require('../controllers/blockchainController')
const session=require('../controllers/session')


router.get('/',(req,res)=>{
    res.render('home',{
        layout:'index',
        isLogged:req.session.isLogged,
        isWorker:req.session.isWorker,
        isProducer:req.session.isProducer,
        isCostumer:req.session.isCostumer,
        success:req.session.success,
        error:req.session.error,
        message:req.session.message
    })
    session.clearNotifications(req)
})
router.get('/chisiamo',(req,res)=>{
    res.render('chisiamo',{
        layout:'index',
        isLogged:req.session.isLogged,
        producers:req.session.producers
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
    var rawMaterials=session.getListOwnRawMaterial(req)
    if(isLogged){
        res.render('newrawmaterial',{
            layout:'index',
            rawMaterials:rawMaterials,
            error:req.session.error,
            success:req.session.success,
            message:req.session.message,
            isProducer:req.session.isProducer,
            isLogged:isLogged
        })
    }
    else{
        session.setError(req,'Devi effettuare il login per accedere a questa pagina.')
        console.log(req.session.message)
        console.log(req.session.error)
        res.redirect('/')
    }
    session.clearNotifications(req);
})

router.get('/newproduct',(req,res)=>{
    var isLogged=req.session.isLogged;
    var products=session.getListOwnProducts(req)
    if(isLogged){
        res.render('newproduct',{
                layout:'index',
                success:req.session.success,
                message:req.session.message,
                products:products,
                isWorker:req.session.isWorker,
                isLogged:isLogged,
                error:req.session.error,
            })
    }
    else{
        session.setError(req,'Devi effettuare il login per accedere a questa pagina.')
        console.log(req.session.message)
        console.log(req.session.error)
        res.redirect('/')
    }
    session.clearNotifications(req);
})

router.get('/listrawmaterials',(req,res)=>{
    var isLogged=req.session.isLogged;
    var producers = session.getListProducers(req)
    var ownRawMaterials = session.getListOwnRawMaterial(req)
    var rawMaterials = session.getListRawMaterial(req)
    if(isLogged){
        res.render('listrawmaterials',{
            layout:'index',
            isLogged:isLogged,
            producers:producers,
            isWorker:req.session.isWorker,
            ownRawMaterials:ownRawMaterials,
            rawMaterials:rawMaterials
        })
    }
    else{
        session.setError(req,'Devi effettuare il login per accedere a questa pagina.')
        console.log(req.session.message)
        console.log(req.session.error)
        res.redirect('/')
    }
    session.clearNotifications(req);
})

router.get('/listproducts',(req,res)=>{
    var isLogged=req.session.isLogged;
    var workers = session.getListWorkers(req)
    var products= session.getListProducts(req)
    var ownProducts= session.getListOwnProducts(req)
    if(isLogged){
        res.render('listproducts',{
            layout:'index',
            isLogged:isLogged,
            workers:workers,
            products:products,
            ownProducts:ownProducts
        })
    }
    else{
        session.setError(req,'Devi effettuare il login per accedere a questa pagina.')
        console.log(req.session.message)
        console.log(req.session.error)
        res.redirect('/')
    }
    session.clearNotifications(req);
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
            wallet_address:user.wallet_address,
            isWorker:req.session.isWorker,
            isProducer:req.session.isProducer
        })
    }else{
        session.setError(req,'Devi effettuare il login per accedere a questa pagina.')
        console.log(req.session.message)
        console.log(req.session.error)
        res.redirect('/')
    }
    session.clearNotifications(req);
})

    


router.get('/nuovoaccount',blockchainController.newAccount)


module.exports=router;