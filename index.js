const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const mongoose = require('mongoose');
const menuRoutes = require('./Routes/MenuRoutes')
const userRoutes = require('./Routes/userRoutes');
const orderRoutes = require('./Routes/orderRoutes');
require('dotenv').config(); 
const jwt = require('jsonwebtoken');


// middleware

app.use(cors(
   { origin: "http://localhost:5173",
    credentials: true
   })
);
app.use(express.json());
// verify token
const verifyToken = (req,res,next)=>{

}

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
// auth routes
app.post('/jwt', (req, res) => {
    const user = req.body;

    jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json({ token });
        }
    });
});

// user routes
app.use("/user",userRoutes);

// menu routes
app.use("/menu",menuRoutes);

// order routes
app.use("/order",orderRoutes);




app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})