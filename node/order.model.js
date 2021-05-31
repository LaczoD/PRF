const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    username: {type: String, unique: false, required: true, lowercase: true},
    product: [{
        name: {type: String, unique: false, required: true},
        description: {type: String, required: false},
        price: {type: Number, required: true},
        quantity: {type: Number, required: true}}],
    date: {type: Date, required: false}
}, {collection: 'order'});

mongoose.model('order', orderSchema);