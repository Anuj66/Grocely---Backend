const mongoose = require('mongoose');
const {Schema} = mongoose;

const BuyerSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'product'
    },
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user'
    },
    quantity: {
        type: Number,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

BuyerSchema.index({
    product: 1,
    user: 1
},{
    unique: true
})

const Buyer = mongoose.model('Buyer', BuyerSchema);

module.exports = Buyer