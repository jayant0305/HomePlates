const express=require('express')
const App=express()
const path=require('path')
const hbs=require('hbs') //handle bar 
const DB=require('./DB/mongoose') 
const dotenv=require('dotenv')
dotenv.config({path:'./src/config.env'});
const Login=require('./DB/Login')
const Signup=require('./DB/Signup')
const bcrypt=require('bcryptjs')
const async = require('hbs/lib/async')
const { Sign } = require('crypto')
const Razorpay = require('razorpay');
const PORT=2000 
const jwt=require('jsonwebtoken')

const googlesso=require('./Router/googlesso')
const public_path=path.join(__dirname,"/public")
const views_path=path.join(__dirname,"/Templateengine/views")
const partials_path=path.join(__dirname,"/Templateengine/partials")

App.use(require('./Router/auth'))
App.use(express.urlencoded())
App.use(express.static(public_path))
App.set('view engine','hbs')
App.set('views',views_path)
hbs.registerPartials(partials_path)
App.use(express.json())


// Connecting DB
DB();

// POST
App.post("/login",async(req,res)=>{
    try {
      const phone=req.body.phone
      const password=req.body.password
      const user=await Login.findOne({phone:phone})
      const isMatch=await bcrypt.compare(password, user.password)
      // const token=await user.generateToken()
      // console.log (token)

      if(isMatch){
        res.status(201).render('profile',{user:user.name})
      }
      else{
        res.render('login',{notvalid:"Invalid phone number or password"})
      }

     } catch (error) {
         res.render('login')
         console.log("NO_login")
     }
})

App.post("/signup",async(req,res)=>{
    try {
        
        const Password_signup=req.body.Password_sign
        const Phone_signup=req.body.Phone_sign
        const Name_signup=req.body.Name_sign
        const Email_signup=req.body.Email_sign

        if(Signup.findOne(Phone_signup)){
        const newSignup= new Signup({
            name_signup:Name_signup,
            email_signup:Email_signup,
            phone_signup:Phone_signup,
            password_signup:Password_signup
       })
       
       const newLogin= new Login({
            name:Name_signup,
            phone:Phone_signup,
            password:Password_signup
        })

        const token=await newSignup.generateToken()

        res.status(201).render('profile',{user:Name_signup,phone:Phone_signup,email:Email_signup})
        
        const save_signup=await newSignup.save();
        const save_login=await newLogin.save();
        
    }
    else{
        res.render('signup')
    }
    } catch (error) {
        res.render("start")
        console.log(error)

    }
})

App.use((req,res)=>{
    res.status(404)
    res.send({
        error:"Not Found",
        status:404
    })
}) 

App.listen(PORT,(err)=>{
    console.log(`Connected ${PORT}`)
})