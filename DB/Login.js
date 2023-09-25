const mongoose=require('mongoose')
const bcrypt=new require('bcryptjs')
const jwt=require('jsonwebtoken')
const newSchema=new mongoose.Schema({
    name:{
        type:String,        
        require:true,
        unique:true
    },
    phone:{
        type:Number,
        require:true,
        unique:true,
        min:10
    },
    password:{
        type:String,
        require:true,
        unique:true,
    }
 })

 newSchema.pre("save",async function(next){
    this. password=await bcrypt.hash(this.password,5)
    console.log(`${this.password}`)
    next(); 
})
const Login=new mongoose.model('Login',newSchema)
 module.exports=Login