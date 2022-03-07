const mongoose = require('mongoose');
const {Schema} = mongoose;

const VendorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
})

const Vendor = mongoose.model('Vendor', VendorSchema);

module.exports = Vendor