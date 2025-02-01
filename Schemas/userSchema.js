const { array } = require('joi');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
   cartItem: {
        type:Array,
        default:[]
    }
})
module.exports = userSchema;