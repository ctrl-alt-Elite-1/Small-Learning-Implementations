const express = require("express");
const app = express();
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const { auth, JWT_SECRET } = require("./auth");
const bcrypt=require("bcrypt");
//const JWT_Secret="Ganapati_Bappa_Morya";

app.use(express.json());
mongoose.connect("mongodb+srv://admin:bmts5YVMS4M8YHQc@cluster0.w2afn.mongodb.net/TODO-app-DB")
const {UserModel,TodoMpdel}=require('./db');


app.post("/signup", async function(req, res) {

    const mailId=req.body.email;
    const name=req.body.name;
    const password=req.body.password;

   try{
    const hashedpassword=await bcrypt.hash(password,10)

    await UserModel.create({
        name:name,
        email:mailId,
        password:hashedpassword
    });
   }catch(e){
        res.json({
            message:"User Already exits"
        })

   }
    res.json({
        message:"You are Signed Up"
    })
    
});


app.post("/signin", async function(req, res) {

    const mailId=req.body.email;
    const password=req.body.password;

    const response=await UserModel.findOne({
        email:mailId,
        
    });

    if(!response){
        res.status(403).json({
            message:"User does not exits"
        }) 
    }

    const passwordMatch=bcrypt.compare(password,response.password);


    if (passwordMatch) {
        const token = jwt.sign({
            id: response._id.toString()
        },JWT_Secret)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
});


app.post("/todo",auth, function(req, res) {
    
    const userId=req.userId;
    const description=req.body.description;
    
    TodoModel.create({
        userId,
        description  
    })

    res.json({
        userId:userId
    })



});


app.get("/todos",auth,async function(req, res) {

const userId=req.userId;
const user= await TodoModel.findOne({
    userId:userId
})

res.json({
    todos
})


});

app.listen(3000);