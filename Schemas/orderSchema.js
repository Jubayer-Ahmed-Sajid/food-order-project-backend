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
    }

})
module.exports = orderSchema;