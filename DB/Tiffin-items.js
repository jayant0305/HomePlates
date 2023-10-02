const mongoose=require('mongoose')
const newSchema=new mongoose.Schema({
    name:{
        type:String,        
        require:true,
    },
    image:{
        type:String,        
        require:true,
    },
    pricePerPerson:{
        type:String,
    },
    price:{
        type:Number
    },
    subCategory:{
        type:String,
        require:true,
    },
    deliveryTime:{
        type:String,
        require:true,
    },
    rating:{
        type:String
    }
 })
const TiffinItems=new mongoose.model('Tiffin-items',newSchema)
module.exports=TiffinItems