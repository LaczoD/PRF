const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true, lowercase: true},
    cart: {type: Object, required: true},
    date: {type: Date, required: false},
}, {collection: 'order'});

mongoose.model('order', orderSchema);