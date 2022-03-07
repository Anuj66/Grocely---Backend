const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Vendor = require("../models/Vendor");
const fetchUser = require("../middleware/FetchUser");

const router = express.Router();
const jwt_key = "This is a secret key"

// Route to Create a User
router.post('/createUser', [
    body('name', 'Please enter a valid name').isLength({min: 3}),
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Please enter a valid password').isLength({min: 5})
] ,async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() });
    }

    try{
        let user = await User.findOne({email: req.body.email})
        if(user){
            return res.status(400).json({success, error: 'User with this email already exists'})
        }

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt)

        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword
        }).then(user => {
            const payload = {
                user: {
                    id: user.id,
                }
            }
            const jwt_token = jwt.sign(payload, jwt_key)
            // console.log(jwt_token)
            success = true
            return res.status(200).json({success, jwt_token})
        })

    }catch(error){
        return res.status(500).json({ success, error: 'Internal Server Error'})
    }

})

// Route to Create a Vendor
router.post('/createVendor', [
    body('name', 'Please enter a valid name').isLength({min: 3}),
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Please enter a valid password').isLength({min: 5})
] ,async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() });
    }

    try{
        let vendor = await Vendor.findOne({email: req.body.email})
        if(vendor){
            return res.status(400).json({success, error: 'Vendor with this email already exists'})
        }

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt)

        await Vendor.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword
        }).then(user => {
            const payload = {
                user: {
                    id: user.id,
                }
            }
            const jwt_token = jwt.sign(payload, jwt_key)
            // console.log(jwt_token)
            success = true
            return res.status(200).json({success, jwt_token})
        })

    }catch(error){
        return res.status(500).json({ success, error: 'Internal Server Error'})
    }

})

// Route to Login a User
router.post('/userLogin', [
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Please enter a valid password').isLength({min: 3})
], async(req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() });
    }

    try{
        const {email, password} = req.body
        let user = await User.findOne({email})
        // console.log(user)

        if(!user){
            return res.status(400).json({success, error: 'Please enter the correct credentials!'})
        }

        const passwordCompare = await bcrypt.compare(password, user.password)

        if(!passwordCompare){
            return res.status(400).json({success, error: 'Please enter the correct credentials!'})
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        const jwt_token = jwt.sign(payload, jwt_key)
        success = 'true'
        return res.json({success, jwt_token})

    }catch(error){
        return res.status(500).json({success, error: 'Internal Server Error'})
    }

})

// Route to Login a Vendor
router.post('/vendorLogin', [
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Please enter a valid password').isLength({min: 3})
], async(req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() });
    }

    try{
        const {email, password} = req.body
        let vendor = await Vendor.findOne({email})
        // console.log(vendor)

        if(!vendor){
            return res.status(400).json({success, error: 'Please enter the correct credentials!'})
        }

        const passwordCompare = await bcrypt.compare(password, vendor.password)

        if(!passwordCompare){
            return res.status(400).json({success, error: 'Please enter the correct credentials!'})
        }

        // console.log("password Compared")
        const payload = {
            user: {
                id: vendor.id
            }
        }

        const jwt_token = jwt.sign(payload, jwt_key)
        success = 'true'
        return res.json({success, jwt_token})

    }catch(error){
        return res.status(500).json({success, error: 'Internal Server Error'})
    }

})


// Route to get details of Logged-In User
router.get('/getUser',fetchUser ,async (req, res) => {
    try{
        let userId = req.user.id
        const user = await User.findById(userId)
        return res.status(200).send(user)
    }catch(error){
        return res.status(501).json({error: 'Internal Server Error'})
    }
})

// Route to get details of Logged In Vendor
router.get('/getVendor',fetchUser ,async (req, res) => {
    let success = false
    try{
        let userId = req.user.id
        const vendor = await Vendor.findById(userId)
        success = true
        return res.status(200).json({success, vendor})
    }catch(error){
        return res.status(501).json({success, error: 'Internal Server Error'})
    }
})

// Route to Get All Vendors
router.get('/getAllVendors', fetchUser, async (req, res) => {
    let success = false
    try{
        const vendors = await Vendor.find({})
        success = true
        return res.status(200).json({success, vendors})
    }catch(error){
        return res.status(500).json({success, error: 'Internal Server Error'})
    }
})

// Route to Update a User


// Route to Update a Vendor



module.exports = router