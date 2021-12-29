const express=require('express');
const { home } = require('nodemon/lib/utils');
const router=express.Router()

router.get('/',(req,res)=>{
    res.render('home',{
        layout:'index'
    })
})
router.get('/chisiamo',(req,res)=>{
    res.render('chisiamo',{
        layout:'index'
    })
})



module.exports=router;