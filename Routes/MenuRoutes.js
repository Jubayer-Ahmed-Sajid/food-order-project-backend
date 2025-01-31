const express = require("express");
const joi = require("joi");
const router = express.Router();
const mongoose = require("mongoose");
const menuSchema = require("../Schemas/menuSchema")
const Menu = new mongoose.model("Menu", menuSchema);
const menuSchemaValidation = joi.object({
  name: joi.string().required(),
  category:  joi.string().default("UnCategorized"),
  price: joi.number().required(),
  availability: joi.boolean().default(true),
  image:joi.string().required()
});

//bulk validation schema
const bulkMenuSchemaValidation = joi.array().items(menuSchemaValidation);

// routes

// get all menu items
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find();
    res.status(200).json({message:"Data successfully fetched ", menu });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get menu item by id
router.get("/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const menu = await Menu.findById(id);
        res.status(200).json({message:"Data successfully fetched ", menu });
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
 
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
    const { error } = bulkMenuSchemaValidation.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

 

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
router.put('/:id', async(req,res)=>{
    const {error} = menuSchemaValidation.validate(req.body);
    if(error) return res.status(400).json({message:error.details[0].message});
    try{
        const id = req.params.id;
        const menu = await Menu.findById(id);
        if(!menu) return res.status(404).json({message:"Menu item not found"});
        const updatedMenu = await Menu.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json({message:"Menu item updated successfully", updatedMenu});


    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
});

// delete menu item by id
router.delete('/:id', async(req,res)=>{
    const id = req.params.id;
    try{
        const menu = await Menu.findByIdAndDelete(id);
        if (!menu) return res.status(404).json({ success: false, message: "Menu item not found" });
        res.status(200).json({message:"Menu item deleted successfully", menu});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
});


module.exports = router;
