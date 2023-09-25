const mongoose=require('mongoose')
const bcrypt=new require('bcryptjs')
const jwt=require('jsonwebtoken')

const newSchema=new mongoose.Schema({
    name_signup:{
         type:String,        
         require:true,
         unique:true
     },
    email_signup:{
        type:String,
        require:true,
        unique:true
    },
    phone_signup:{
        type:Number,
        require:true,
        unique:true,
        min:10
    },
    password_signup:{
        type:String,
        require:true,
        unique:true,
    },
    tokens:[{
        token:{
            type:String,
            require:true,
        }
    }]
 })
newSchema.methods.generateToken=async function(){
    try{
       
        const token=await jwt.sign({_id:this._id},"secretkeyjwt",{
            expiresIn:"15 days"
        })
        this.tokens=this.tokens.concat({token:token})
        await this.save()
        return token
         
    }
    catch(error){
        console.log("ERROR IN JWT TOKEN GENERATION")
    }
}
newSchema.pre("save",async function(next){
    this. password_signup=await bcrypt.hash(this.password_signup,5)
    console.log(`${this.password_signup}`)
    next(); 
})
const Signup=new mongoose.model('Signup',newSchema)
 module.exports=Signup