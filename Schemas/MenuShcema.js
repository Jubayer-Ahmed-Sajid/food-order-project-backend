const mongoose = require('mongoose');
const menuSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:String,
    price:{
        type:Number,
        required:true
    },
    availability:{
        type:Boolean,
        default:true
    }
});
module.exports = menuSchema;