const jwt=require('jsonwebtoken')
const Signup=require('../DB/Signup')

const jwtauth=async(req,res,next)=>{
    try{
        const token =req.cookies.JWTtoken
        const verifyUser=jwt.verify(token,process.env.SECRETKEY_JWT)
        const token_ID=await Signup.findOne({_id:verifyUser._id})
        const user=await Signup.findOne({_id:token_ID._id})
        res.locals.user = user;  
        console.log(res.locals.user.name_signup)
        
        next()
    }
    catch(error){
        console.log(error)
        res.status(401)
        res.redirect('/login')
    }
}


module.exports =jwtauth