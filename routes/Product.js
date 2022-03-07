const express = require('express');
const fetchUser = require("../middleware/fetchUser");
const Product = require("../models/Product");

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello')
})


//Add a Product
router.post('/addProduct', fetchUser, async (req, res) => {
    let success = false
    try{
        const product = await Product.findOne({name: req.body.name, vendor: req.user.id})
        if(product){
            return res.status(400).json({success, error: 'ProductContext already exists'})
        }

        const newProduct = new Product({
            name: req.body.name,
            vendor: req.user.id,
            type: req.body.type,
            price: req.body.price,
            stock: req.body.stock
        })

        await newProduct.save()
        success = true
        return res.status(200).json({success, newProduct})

    }catch(error){
        return res.status(500).json({success, error: 'Internal Server Error'})
    }
})

//Get a ProductContext by Id
router.get('/getProduct/:id', fetchUser, async (req, res) => {
    let success = false
    try{
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(200).json('No products found')
        }
        success = true
        return res.status(200).json({success, product})
    }catch(error){
        return res.status(500).json({success, error: 'Internal Server Error'})
    }
})

//Get a Products by Name
router.get('/getProductByName/:name', fetchUser, async (req, res) => {
    try{
        const products = await Product.find({name: req.params.name})
        if(!products){
            return res.status(200).json('No products found')
        }
        return res.status(200).json(products)
    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

//Get Products by Vendor
router.get('/getProductByVendor/:vendorId', fetchUser, async (req, res) => {
    try{
        const products = await Product.find({vendor: req.params.vendorId})
        if(!products){
            return res.status(200).json('No products found')
        }
        return res.status(200).json(products)
    }catch(error){
        return res.status(500).json({ error: 'Internal Server Error'})
    }
})

//Get Products by Product Type
router.get('/getProductByType/:typeId', fetchUser, async (req, res) => {
    try{
        const products = await Product.find({type: req.params.typeId})
        if(!products){
            return res.status(200).json('No products found')
        }
        return res.status(200).json(products)
    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

//Get All Products
router.get('/getAllProducts', fetchUser, async (req, res) => {
    try{
        const products = await Product.find({})
        if(!products){
            return res.status(200).json('No products found')
        }
        return res.status(200).json(products)
    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

//Update a Product
router.put('/updateProduct/:id', fetchUser, async (req, res) => {
    let success = false
    try{
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(400).json({success, error: 'No ProductContext Found'})
        }

        const {name, type, price, stock} = req.body

        const newProduct = {}
        if(name){newProduct.name = name}
        if(type){newProduct.type = type}
        if(price){newProduct.price = price}
        if(stock){newProduct.stock = stock}

        newProduct.vendor = req.user.id;
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {$set: newProduct}, {new: true})
        success = true
        return res.status(200).json({success, updatedProduct})
    }catch(error){
        return res.status(500).json({success, error: 'Internal Server Error'})
    }
})

//Delete a Product
router.delete('/deleteProduct/:id', fetchUser, async (req, res) => {
    let success = false
    try{
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(400).json({error: 'No ProductContext Found'})
        }

        await Product.findByIdAndDelete(req.params.id)
        success = true
        return res.status(200).json({success, message: 'ProductContext is deleted'})
    }catch(error){
        return res.status(500).json({success, error: 'Internal Server Error'})
    }
})

//Update a Product w.r.t User Cart
router.put('/updateUserProduct/:id', fetchUser, async (req, res) => {
    let success = false
    try{
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(400).json({success, error: 'No ProductContext Found'})
        }

        const newProduct = {
            name: req.body.name,
            type: req.body.type,
            vendor: req.body.vendor,
            stock: req.body.stock,
            price: req.body.price
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {$set: newProduct}, {new: true})
        success = true
        return res.status(200).json({success, updatedProduct})

    }catch(error){
        return res.status(500).json({success, error: 'Internal Server Error'})
    }
})

module.exports = router