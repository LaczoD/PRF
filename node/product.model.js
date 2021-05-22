const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    description: {type: String, required: false},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true}
}, {collection: 'product'});

mongoose.model('product', productSchema);