const express = require('express');
const {
    raw
} = require('mysql');
const router = express.Router()
const blockchainController = require('../controllers/blockchainController')
const session = require('../controllers/session')
const encrypter = require('../controllers/crypt')

router.get('/', (req, res) => {
    res.render('home', {
        layout: 'index',
        isLogged: req.session.isLogged,
        isWorker: req.session.isWorker,
        isProducer: req.session.isProducer,
        isCustomer: req.session.isCustomer,
        success: req.session.success,
        error: req.session.error,
        message: req.session.message
    })
    session.clearNotifications(req)
})
router.get('/chisiamo', (req, res) => {
    res.render('chisiamo', {
        layout: 'index',
        isLogged: req.session.isLogged,
        producers: req.session.producers
    })
})
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'index',
        success: req.session.success,
        message: req.session.message,
        error: req.session.error
    })
    session.clearNotifications(req)
})

router.get('/register', (req, res) => {
    res.render('register', {
        layout: 'index',
        error: req.session.error,
        warning: req.session.warning,
        message: req.session.message
    })
    session.clearNotifications(req);


})

router.get('/newrawmaterial', (req, res) => {
    var isLogged = req.session.isLogged;
    var ownRawMaterials = session.getListOwnRawMaterial(req)
    if (isLogged) {
        res.render('newrawmaterial', {
            layout: 'index',
            ownRawMaterials: ownRawMaterials,
            error: req.session.error,
            success: req.session.success,
            message: req.session.message,
            type: session.getProfile(req).type,
            isProducer: req.session.isProducer,
            isLogged: isLogged
        })
    } else {
        session.setError(req, 'Devi effettuare il login per accedere a questa pagina.')
        console.log(req.session.message)
        console.log(req.session.error)
        res.redirect('/')
    }
    session.clearNotifications(req);
})

router.get('/newproduct', async (req, res) => {
    var productSelection = session.getListProductSelection(req)
    var isLogged = req.session.isLogged;

    if (isLogged) {
        var products = session.getListOwnProducts(req)
        await blockchainController.getListOwnRawMaterials(req)
        var ownRawMaterials = session.getListOwnRawMaterial(req)
        res.render('newproduct', {
            layout: 'index',
            success: req.session.success,
            message: req.session.message,
            products: products,
            productSelection: productSelection,
            isWorker: req.session.isWorker,
            isLogged: isLogged,
            error: req.session.error,
            ownRawMaterials: ownRawMaterials
        })
    } else {
        session.setError(req, 'Devi effettuare il login per accedere a questa pagina.')
        console.log(req.session.message)
        console.log(req.session.error)
        res.redirect('/')
    }
    session.clearNotifications(req);
})

router.get('/listrawmaterials', (req, res) => {
    var isLogged = req.session.isLogged;
    var producers = session.getListProducers(req)
    var ownRawMaterials = session.getListOwnRawMaterial(req)
    console.log(ownRawMaterials)
    var rawMaterials = session.getListRawMaterial(req)
    if (isLogged) {
        res.render('listrawmaterials', {
            layout: 'index',
            isLogged: isLogged,
            producers: producers,
            isWorker: req.session.isWorker,
            ownRawMaterials: ownRawMaterials,
            rawMaterials: rawMaterials
        })
    } else {
        session.setError(req, 'Devi effettuare il login per accedere a questa pagina.')
        console.log(req.session.message)
        console.log(req.session.error)
        res.redirect('/')
    }
    session.clearNotifications(req);
})

router.get('/listproducts', (req, res) => {
    var isLogged = req.session.isLogged;
    var workers = session.getListWorkers(req)
    var products= session.getListProducts(req)
    var ownProducts= session.getListOwnProducts(req)
    if(isLogged){
        res.render('listproducts',{
            layout:'index',
            isLogged:isLogged,
            workers:workers,
            products:products,
            isCustomer:req.session.isCustomer,
            ownProducts:ownProducts
        })
    } else {
        session.setError(req, 'Devi effettuare il login per accedere a questa pagina.')
        console.log(req.session.message)
        console.log(req.session.error)
        res.redirect('/')
    }
    session.clearNotifications(req);
})

router.get('/profilo', (req, res) => {
    if (req.session.isLogged) {
        user = session.getProfile(req)
        decryptedAddress = encrypter.decrypt(user.wallet_address.toString());
        res.render('profilo', {
            layout: 'index',
            isLogged: req.session.isLogged,
            email: user.email,
            name: user.name,
            surname: user.surname,
            ruolo: user.ruolo,
            wallet_address: decryptedAddress,
            isWorker: req.session.isWorker,
            isProducer: req.session.isProducer,
            isCustomer: req.session.isCustomer
        })
    } else {
        session.setError(req, 'Devi effettuare il login per accedere a questa pagina.')
        console.log(req.session.message)
        console.log(req.session.error)
        res.redirect('/')
    }
    session.clearNotifications(req);
})




router.get('/nuovoaccount', blockchainController.newAccount)


module.exports = router;