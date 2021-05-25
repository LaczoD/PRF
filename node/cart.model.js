const mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true, lowercase: true},
    product: [{
        name: {type: String, unique: true, required: true},
        description: {type: String, required: false},
        price: {type: Number, required: true},
        quantity: {type: Number, required: true}}]
}, {collection: 'cart'});

mongoose.model('cart', cartSchema);
