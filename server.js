// CREATE SERVER
const express = require("express")
const app = express()
const bcrypt =require('bcrypt')
const  jwb =require('jsonwebtoken')
const _PORT = 3001;
const cors = require("cors")
app.use(cors())
app.use(express.json())


// CONNECT TO DB


const mongoose = require("mongoose")

// mongoose.connect(`mongodb://127.0.0.1:27017/zit`)
mongoose.connect(`mongodb+srv://tayger:Logikar2000@digitalstore.geqedva.mongodb.net/?retryWrites=true&w=majority&appName=digitalStore`)


// USER MODEL
const UserModel = require('./models/Users')


// get request
app.get("/", async (req, res)=>{
    
    res.send("hello world")
})

// get current user
app.get("/users/:id", async (req, res)=>{
    const id=req.params.id
    const user = await UserModel.findById(id);
    res.json({user:user})
})


// create user
app.post("/registre", async (req, res) => {
    const password=await req.body.password
    const hashpassword=bcrypt.hashSync(password ,10)
    const newUser = new UserModel({
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        password:hashpassword,
        role:"user",
    });
    await newUser.save();
    res.json({message :"registre created successfily"})
})
// login
app.post("/login", async (req, res) => {
    const User = await UserModel.findOne({email:req.body.email})

    if(User){
    const passwordValid = await bcrypt.compare(req.body.password ,User.password)
    if(passwordValid){
        var accestoken = jwb.sign({id:User._id},"tahar")
        res.json({token:accestoken ,id:User._id,name:`${User.first_name} ${User.last_name}`})
    }else{
        res.json({error:"Invalid email or password"})
    }
    }else{
        res.json({error:"Sign up First"})
    }
})






//Product Model 
const ProductModel =require('./models/Products')
// get all product
app.get('/products' ,async (req,res)=>{
    const products =await ProductModel.find({});
    res.json(products)
})

// get one product
app.get('/products/:id' ,async (req,res)=>{
    const id =req.params.id
    const product =await ProductModel.findById(id);
    res.json(product)
})

// create product
app.post('/products' ,async (req,res)=>{
    console.log(req.body.product_link)
    const newProduct = await ProductModel.create({
        title:req.body.title ,
        image:req.body.image ,
        image1:req.body.image1 ,
        description:req.body.description ,
        price:req.body.price ,
        category:req.body.category ,
        product_link:req.body.product_link ,
    })

     res.json({message :"product created successfily",product:newProduct})
})

// update product

app.put('/products/:id' ,async (req,res)=>{
    const id =req.params.id
    const product = await ProductModel.findById(id)
    if(product){
        product.title =req.body.title,
        product.image =req.body.image,
        product.image1 =req.body.image1,
        product.description =req.body.description,
        product.price =req.body.price,
        product.category =req.body.category
        product.product_link =req.body.product_link
         await product.save()
         res.json({message:"updated successfily"})
    }else{
        res.json({error :"product not exists"})
    }
    
})

// delete product
app.delete('/products/:id' ,async (req,res)=>{
    const id =req.params.id
    await ProductModel.deleteOne({_id:id})
        res.json({message :"product deleted success"})
})



// Favorit Model
const FavoritModel=require("./models/Favorit")

// get all Favorit   products
app.get("/favorit/:id" ,async (req ,res)=>{
    const id=req.params.id
    const favorits=(await FavoritModel.find({user_id:id},{_id:0,product_id:1})).map(ob=>ob.product_id);
    
    const productsLiked=await ProductModel.find({_id:{$in:favorits}})
    res.json(productsLiked)
})

// Add Item to Favorit

app.post('/favorit' ,async(req,res)=>{
    const favorit =await FavoritModel.findOne({user_id:req.body.user_id ,product_id:req.body.product_id});
    if(favorit){
        await FavoritModel.deleteOne({_id:favorit._id})  
        res.json({message :"Item Delete from wishlist"})
    }else{
        const newFavorit=await FavoritModel.create({
        user_id:req.body.user_id,
        product_id:req.body.product_id,
    })
    res.json({message:"item added to wishlist successfily"})
    }

})



























app.listen(_PORT, ()=>{
    console.log("Server Works")
})