const express=require('express')
const App=express()
const path=require('path')
const hbs=require('hbs') //handle bar 
const DB=require('./DB/mongoose') 
const dotenv=require('dotenv')
dotenv.config({path:'./src/config.env'});
const Login=require('./DB/Login')
const Signup=require('./DB/Signup')
const foodItem=require('./DB/Food-items')
const tiffinItem=require('./DB/Tiffin-items')
const bcrypt=require('bcryptjs')
const async = require('hbs/lib/async')
const { Sign } = require('crypto')
const Razorpay = require('razorpay');
const PORT=process.env.PORT |2170
const jwt=require('jsonwebtoken')
const cookieParser=require("cookie-parser")
const jwtauth=require('./Middleware/jwtmiddleware')
const googlesso=require('./Router/googlesso')
const TiffinItems = require('./DB/Tiffin-items')

const public_path=path.join(__dirname,"/public")
const views_path=path.join(__dirname,"/Templateengine/views")
const partials_path=path.join(__dirname,"/Templateengine/partials")

App.use(require('./Router/auth'))
App.use(cookieParser())
App.use(express.urlencoded({extended:true}))
App.use(express.static(public_path))
App.set('view engine','hbs')
App.set('views',views_path)
hbs.registerPartials(partials_path)
App.use(express.json())


// Connecting DB
DB();


//INSTANTIATE RAZORPAY
var instance = new Razorpay({
    key_id: process.env.KEY,
    key_secret: process.env.KEY_SEC,
  });


// POST
App.post("/addFoodItem",async(req,res)=>{
    try{
            console.log(req.body.name)
            const foodItemInstance= new foodItem({
            name:req.body.name,
            image:req.body.image,
            pricePerPerson:req.body.pricePerPerson,
            deliveryTime:req.body.deliveryTime,
            price:req.body.price,
            subCategory:req.body.subCategory,
            rating:req.body.rating
       })
        const val=await foodItemInstance.save()
        res.json(val)   
    }
    catch(error){
        console.log(error)
    }
    
})
App.post("/addTiffinItem",async(req,res)=>{
    try{
            console.log(req.body.name)
            const tiffinItemInstance= new tiffinItem({
            name:req.body.name,
            image:req.body.image,
            pricePerPerson:req.body.pricePerPerson,
            deliveryTime:req.body.deliveryTime,
            price:req.body.price,
            subCategory:req.body.subCategory,
            rating:req.body.rating
       })
        const val=await tiffinItemInstance.save()
        res.json(val)   
    }
    catch(error){
        console.log(error)
    }
    
})

App.post("/login",async(req,res)=>{
    try {
      const user=await Signup.findOne({phone_signup:req.body.phone})
      const isMatch= await bcrypt.compare(req.body.password,user.password_signup)
      console.log(isMatch)
    
      if(isMatch){
        const token=await user.generateToken()
        console.log ("token generated in /login : "+ token)
        res.cookie("JWTtoken",token,{
        expires:new Date(Date.now()+10000000),
        httpOnly:true
        })
        res.status(201)
        res.redirect('/profile')
      }
      else{
        res.render('login',{notvalid:"Invalid phone number or password"})
      }

     } catch (error) {
         res.redirect('/signup')
         console.log(error)
     }
})

App.post("/signup",async(req,res)=>{
    try {
        
        const Password_signup=req.body.Password_sign
        const Phone_signup=req.body.Phone_sign
        const Name_signup=req.body.Name_sign
        const Email_signup=req.body.Email_sign
        console.log("SIGNIn pass:"+Password_signup)
        const user=await Signup.findOne({phone_signup:req.body.Phone_sign})
        console.log(user)
        if(user==null){
        const newSignup= new Signup({
            name_signup:Name_signup,
            email_signup:Email_signup,
            phone_signup:Phone_signup,
            password_signup:Password_signup
       })

        const token=await newSignup.generateToken()
        console.log("Token Generate-signup ")
        res.cookie("JWTtoken",token,{
            expires:new Date(Date.now()+1000000),
            httpOnly:true
        })
        res.redirect('/profile')
        const save_signup=await newSignup.save();
        
    }
    else{
        res.redirect('/login')
    }
    } catch (error) {
        res.redirect('/')
        console.log(error)

    }
})

App.get("/profile",jwtauth,async(req,res)=>{
    if(res.locals.user!=null){
        res.render('profile',{user:res.locals.user,roleAdim:true})
    }
    else{
        res.render('profile')
    }
})

App.get("/cart",jwtauth,async(req,res)=>{
    if(res.locals.user!=null){
        const userID=await res.locals.user
        let totalAmount = 0;
        if(userID.carts.length>0){
            res.locals.user.carts.forEach((Mycart) => {
                totalAmount = totalAmount + Mycart.cart.total
            })
        }   
        userID.purchase =totalAmount
        const save=await userID.save()   

        res.render('cart',{carts:res.locals.user.carts,purschase:userID.purchase,userName:userID.name_signup,roleAdim:true})
    }
    else{
        console.log("NO RESPONSE")
        res.render('cart',{purschase:0})
    }
    
})

App.post('/cart',jwtauth,async(req,res)=>{
    if(res.locals.user!=null){
        const userID=await res.locals.user
        var options = {
            amount: req.body.amount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
        };
        console.log("/cart")
        instance.orders.create(options, function(err, order) {
            console.log("order: ",order);
            res.send({orderId:order});
        });
    }
})

App.put('/cart/updateQuantity', jwtauth, async (req, res) => {
    if (res.locals.user != null) {
        const userID = await res.locals.user;
        const data = req.body;
        console.log(data.index, data.quantity)
        let update = {};
        if (data.quantity === 0) {
            update.$unset = { ["carts." + data.index]:0};
            console.log("Quantity:",data.quantity)
            const result = await Signup.findByIdAndUpdate({_id:userID}, update, { new: true });
            if (result) {
                result.carts.splice(data.index, 1); // Remove the item at itemIndex
                await result.save();
                console.log("DELETED");
                res.status(200)

                window.location.reload('/cart');
            } else {
                res.status(404).render('home');
            }
        } else {
            update.$set = { ["carts." + data.index + ".cart.total"]: data.quantity };
            const result = await Signup.findByIdAndUpdate({_id:userID}, update, { new: true });

            if (result) {
                console.log("Updated");
                res.status(200)
                res.redirect('/cart')
            } else {
                res.status(404).render('home');
            }
        }
    
    } else {
        res.status(401).render('login');
    }
});



App.post("/cart/restaurants/:id",jwtauth,async(req,res)=>{
    try{
        if (res.locals.user !== null) {
            const Id=req.params.id
            const food=await foodItem.findOne({_id:Id})
            const userID = await res.locals.user
            let itemIndex = userID.carts.findIndex(item => item.cart && item.cart._id && item.cart._id.toString() === Id);
            console.log(`itemIndex: ${itemIndex}`)
            if(itemIndex !==-1) {
                //found
                const filter = { _id: userID._id };
                const update = {
                    $inc: { ["carts." + itemIndex + ".cart.quantity"]: 1 },
                    $set: {
                        ["carts." + itemIndex + ".cart.total"]:
                            (userID.carts[itemIndex].cart.quantity + 1) * userID.carts[itemIndex].cart.price,
                    },
                };

            const result = await Signup.updateOne(filter, update);
            console.log("total", update.$set["carts." + itemIndex + ".cart.total"]);

            }else{
                //not found
                userID.carts=userID.carts.concat({ cart: food}) 
                userID.carts.length-1
                const result1=await Signup.updateOne(
                    { _id: userID},
                    { $push: { carts:food } }
                )
                await userID.save();
                console.log(userID.carts)
            }
            
            res.status(204).send();
        } else {
            console.log("h")
            res.status(401).redirect('/home');
        }
    }
    catch(err){
        console.log(err)
        res.status(400).render('start')
        return 
    }
})

App.post("/cart/tiffin/:id",jwtauth,async(req,res)=>{
    try{
    const Id=req.params.id
    const tiffin=await tiffinItem.findOne({_id:Id})
   
    if(res.locals.user!=null){
        const userID=res.locals.user
        let itemIndex = userID.carts.findIndex(item => item.cart && item.cart._id && item.cart._id.toString() === Id);
        console.log(`itemIndex: ${itemIndex}`)

        if(itemIndex !==-1) {
            //found
            const filter = { _id: userID._id };
            const update = {
                $inc: { ["carts." + itemIndex + ".cart.quantity"]: 1 },
                $set: {
                    ["carts." + itemIndex + ".cart.total"]:
                        (userID.carts[itemIndex].cart.quantity + 1) * userID.carts[itemIndex].cart.price,
                },
            };
        const result = await Signup.updateOne(filter, update);
        console.log("total", update.$set["carts." + itemIndex + ".cart.total"]);

        }else{
            //not found
            userID.carts=userID.carts.concat({ cart: tiffin}) 
            userID.carts.length-1
            const result1=await Signup.updateOne(
                { _id: userID},
                { $push: { carts:tiffin } }
            )
            await userID.save();
            console.log(userID.carts)
        }
        
        res.status(204).send();
    }
    else{
        res.status(401).redirect('/login')
    }
    }
    catch (err){
        console.log(err)
        res.status(400).redirect('start')
    }
})

App.post("/clearcart",jwtauth,async(req,res)=>{
    if(res.locals.user!=null){
        await Signup.updateOne(
            { _id: res.locals.user._id }, 
            { $set: { carts: [] } } 
        );
    }
    else{
        res.redirect('/login')
    }
    res.status(204).redirect('/cart')
})

App.get("/signOut",jwtauth,async(req,res)=>{
    try{
        console.log("signOut")
        if(res.locals.user!=null){
            console.log("Signout")
            res.clearCookie("JWTtoken")
            res.status(400).redirect('/login')
        }
        else{
            console.log("Else Signout")
            res.status(400).redirect('/login')
        }
    }
    catch(err){
        console.log(err)
        res.status(500).render('start')
        return 
    }
})


App.get('/addItem',jwtauth,async(req,res)=>{
    if(res.locals.user!=null){
        res.render('addItem',{user:res.locals.user.name_signup,roleAdim:true})
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