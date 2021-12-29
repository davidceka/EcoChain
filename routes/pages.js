const express=require('express');
const { home } = require('nodemon/lib/utils');
const router=express.Router()

router.get('/',(req,res)=>{
    res.render('home')
})
router.get('/chisiamo')


module.exports=router;