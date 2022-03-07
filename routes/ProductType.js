const express = require('express');
const ProductType = require("../models/ProductType");

const router = express.Router();

//Add a ProductType
router.post('/addProductType', async (req, res) => {
    try{
        let newProductType= await ProductType.findOne({name: req.body.name})
        if(newProductType){
            return res.status(400).json({error: 'ProductContext Type already exists'})
        }

        const productType = new ProductType({
            name: req.body.name
        })

        const savedPT = await productType.save()
        return res.status(200).json(savedPT)

    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

//Get a ProductType
router.get('/getProductType/:id', async (req, res) => {
    try{
        const productType = await ProductType.findById(req.params.id)
        if(!productType){
            return res.status(400).json({error: 'ProductContext Type not found'})
        }
        return res.status(200).json(productType)
    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

//Update a ProductType
router.put('/updateProductType/:id', async (req, res) => {
    try{
        const productType = await ProductType.findById(req.params.id)
        if(!productType){
            return res.status(400).json({error: 'ProductContext Type not found'})
        }

        const newProductType = {
            name: req.body.name
        }

        const updatedProductType = await ProductType.findByIdAndUpdate(req.params.id, {$set: newProductType}, {new: true})
        return res.status(200).json(updatedProductType)

    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'})
    }
})


//Delete a ProductType
router.delete('/deleteProductType/:id', async (req, res) => {
    try{
        const productType = await ProductType.findById(req.params.id)
        if(!productType){
            return res.status(400).json({error: 'ProductContext Type not found'})
        }

        await ProductType.findByIdAndDelete(req.params.id)
        return res.status(200).send('ProductContext Type deleted')

    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'})
    }
})


//Get All ProductContext Types
router.get('/getAllProductType', async (req, res) => {
    try{

        const productTypes = await ProductType.find({})
        return res.status(200).json(productTypes)

    }catch(error){
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

module.exports = router