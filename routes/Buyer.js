const express = require('express');
const fetchUser = require("../middleware/fetchUser");
const Product = require("../models/Product");
const Buyer = require("../models/Buyer");

const router = express.Router();

//Related to User's account
//Add a ProductContext
router.post('/addProduct', fetchUser, async (req, res) => {
    try{
        let product = await Buyer.findOne({product: req.body.product, user: req.user.id})
        if(product){
            return res.status(400).json({error: 'ProductContext already exists'})
        }

        product = await Product.findById(req.body.product)
        if(!product){
            return res.status(400).json({error: 'ProductContext does not exists'})
        }else{
            if(product.stock < req.body.quantity){
                return res.status(400).json({error: 'Quantity is exceeding the stock'})
            }
        }

        const newProduct = new Buyer({
            product: req.body.product,
            user: req.user.id,
            quantity: req.body.quantity
        })

        const savedProduct = await newProduct.save()

        return res.status(200).json(savedProduct)

    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

//Get a Product
router.get('/getProduct/:id', fetchUser, async (req, res) => {
    let success = true
    try{
        const product = await Buyer.findOne({product: req.params.id})
        if(!product){
            return res.status(400).json({success, error: 'ProductContext does not exists'})
        }
        success = true
        return res.status(200).json({success, product})
    }catch(error){
        return res.status(500).json({success, error: 'Internal Server Error'})
    }
})

//Get All ProductContext w.r.t a user
router.get('/getAllProducts', fetchUser, async (req, res) => {
    try{
        const products = await Buyer.find({user: req.user.id})
        if(!products){
            return res.status(400).json({error: 'No Products found'})
        }

        return res.status(200).json(products)
    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

//Delete a Product
router.delete('/deleteProduct/:id', fetchUser, async (req, res) => {
    try{
        const product = await Buyer.findOne({product: req.params.id})
        if(!product){
            return res.status(400).json({error: 'Product does not exists'})
        }
        await Buyer.findOneAndDelete({product: req.params.id})
        return res.status(200).json('Deleted Successfully')
    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

//Update a Product
router.put('/updateProduct/:id', fetchUser, async (req, res) => {
    let success = false
    try{
        const product = await Buyer.findOne({product: req.params.id})
        if(!product){
            return res.status(400).json({success, error: 'Product does not exists'})
        }
        const newProduct = {
            product: req.params.id,
            user: req.user.id,
            quantity: req.body.quantity
        }

        const updatedProduct = await Buyer.findOneAndUpdate({product: req.params.id}, {$set: newProduct}, {new: true})
        success = true
        return res.status(200).json({success, updatedProduct})
    }catch(error){
        return res.status(500).json({success, error: 'Internal Server Error'})
    }
})

//Delete All Products w.r.t a User
router.delete('/deleteCart', fetchUser, async (req, res) => {
    let success = false
    try{
        await Buyer.deleteMany({ user: { $in: [req.user.id]}})
        success = true
        return res.status(200).json({success})
    }catch(error){
        return res.status(500).json({success, error: 'Internal Server Error'})
    }
})

module.exports = router