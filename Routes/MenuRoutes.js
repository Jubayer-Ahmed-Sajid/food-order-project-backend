const express = require("express");
const joi = require("joi");
const router = express.Router();
const mongoose = require("mongoose");
const menuSchema = require("../Schemas/menuSchema")
const Menu = new mongoose.model("Menu", menuSchema);
const menuSchemaValidation = joi.object({
  name: joi.string().required(),
  category: joi.string(),
  price: joi.number().required(),
  availability: joi.boolean(),
});

// routes

// get all menu items
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find();
    res.status(200).json({ menu });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get menu item by id
router.get("/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const menu = await Menu.findById(id);
        res.status(200).json({ menu });
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
  const id = req.params.id;
  const menu = await Menu.findById(id);
});

// add new menu item 
router.post('/',async(req,res)=>{
    const {error} = menuSchemaValidation.validate(req.body);
    if(error){
       return res.status(400).json({message:error.details[0].message});
    }
    try{
        const newMenu =new Menu(req.body);
        await newMenu.save();
        res.status(201).json({message:"Menu item added successfully", newMenu});
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
    

});

// add multiple menu items
router.post('/all', async(req,res)=>{
    const menus = req.body;
    for(let menu of menus){
        const {error} = menuSchemaValidation.validate(menu);
        if(error){
            return res.status(400).json({message:error.details[0].message});
        }
    }

    try{
        const newMenus = req.body;
        await Menu.insertMany(newMenus);
        res.status(201).json({message: "Menu items added successfully", newMenus});
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});

// update menu item 
router.put('/:id', async(req,res)=>{});

// delete menu item by id
router.delete('/:id', async(req,res)=>{});


module.exports = router;
