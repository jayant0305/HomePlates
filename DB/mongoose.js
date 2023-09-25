const mongoose=require('mongoose')
require('dotenv').config()


function DB(){
    mongoose.connect(process.env.ATLAS)
    .then(()=>{console.log("MONGODB Atlas Connected")}) 
    .catch((err)=>{
        console.log(err)
    })      
} 

module.exports = DB


