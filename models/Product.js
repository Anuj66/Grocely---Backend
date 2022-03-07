const mongoose = require('mongoose');
const {Schema} = mongoose;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'productType'
    },
    time: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'vendor'
    },
    stock: {
        type: Number,
        required: true
    }
});

ProductSchema.index({
    name: 1,
    vendor: 1
},{
    unique: true
})

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product
