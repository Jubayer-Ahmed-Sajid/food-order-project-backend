const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const mongoose = require('mongoose');
const menuRoutes = require('./Routes/MenuRoutes')
require('dotenv').config(); 
// middleware
app.use(cors());
app.use(express.json());

// connect to mongoose
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vqva6ft.mongodb.net/food-orderdb?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(mongoURI)
.then(()=>{
   console.log("MongoDB connected");
})
.catch((err)=>{
    console.log(err);
})
// routes
app.get('/',(req,res)=>{
    res.send("Server is running");
})

// menu routes
app.use("/menu",menuRoutes);


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})