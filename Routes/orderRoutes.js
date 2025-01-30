const express = require("express");
const joi = require("joi");
const mongoose = require("mongoose")
const router = express.Router();
const orderSchema = require("../Schemas/orderSchema")
const Order = new mongoose.model("Order", orderSchema);
const orderSchemaValidation = joi.object({
    userId: joi.string().required(),
    items: joi.array().items(joi.object({
        menuId: joi.string().required(),
        quantity: joi.number().required()
    })).required(),
    totalAmount: joi.number().required(),
    status: joi.string().valid('pending', 'completed').default('pending')
});
// routes
// get all orders
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({ message: "Data successfully fetched ", orders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// get order by id
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const order = await Order.findById(id);
        res.status(200).json({ message: "Data successfully fetched ", order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// add new order
router.post("/", async (req, res) => {
    const { error } = orderSchemaValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: "Order added successfully", newOrder });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;