// Order Schema
const mongoose = require('mongoose');
const orderSchema =new mongoose.Schema({
    userId:{
        type: String,
        required:true
    },
    items:{
        type:Array,
        default:[]
    },
    totalAmount :{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['pending', 'completed']
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})
module.exports = orderSchema;