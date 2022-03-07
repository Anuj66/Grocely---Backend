const mongoose = require('mongoose');
const {Schema} = mongoose;

const ProductTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

const ProductType = mongoose.model('ProductType', ProductTypeSchema);

module.exports = ProductType