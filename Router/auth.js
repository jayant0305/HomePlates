const express=require('express');
const App=express()
const Signup = require('../DB/Signup');
const router=express.Router();
const googlesso=require('./googlesso.js')
const passport=require('passport')
const Razorpay = require('razorpay')
const foodItem=require('../DB/Food-items')
const tiffinItem=require('../DB/Tiffin-items')
require('dotenv').config()
//GET
router.get("/",(req,res)=>{
    res.render('start')
    console.log("/")
})

router.get("/login",(req,res)=>{
    res.render('login')
    console.log("DONE")
})
router.get("/signup",(req,res)=>{
    res.render('signup')
    console.log("DONE")
})

router.get("/home",(req,res)=>{
    foodItem.find().then(function(menu){
        res.render('home', {menu:menu})
    })
    
    console.log("DONE")
})
router.get("/service",(req,res)=>{
    foodItem.find().then(function(menu){
        res.render('service', {menu:menu})
    })
    console.log("DONE")
})

router.get("/Help",(req,res)=>{
    res.render('help')
    console.log("DONE")
})

router.get("/search",(req,res)=>{
    res.render('search')
    console.log("DONE")
})

router.get("/service/tiffin",(req,res)=>{
    tiffinItem.find().then(function(menu){
        res.render('tiffin', {menu:menu})
    })
})

router.get("/user",async (req,res)=>{
    const user=await Signup.find({},{})
    res.status(200).json({user})
})

router.get("/user/:id",async (req,res)=>{
    const user=await Signup.findById(req.params.id)
    res.status(200).json({user})
})

router.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

router.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/home',
        failureRedirect: '/login'
}));

//DELETE 
router.delete("/user/:id",async (req,res)=>{
    try{
        const id=req.params.id
        const delete_user=await Signup.findByIdAndDelete(id)
        res.status(200).json({delete_user})
    }catch(error){
        console.log(error.message)
    }
    
})

//PATCH
router.patch("/user/:id",async (req,res)=>{
    try{
        const id=req.params.id
        const update=req.body
        const path_user=await Signup.findByIdAndUpdate(id,update)
        res.status(200).json({path_user})
    }catch(error){
        console.log(error.message)
    }
    
})

module.exports=router;