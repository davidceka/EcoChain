const express = require("express");
const res = require("express/lib/response");
//const authController = require("../controllers/auth");
const router = express.Router();



router.get('/login',(req,res)=>{
    res.render('login2',{
        layout:'index'
    })
})

module.exports = router;