const mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true, lowercase: true},
    product: {type: Object, required: true}
}, {collection: 'cart'});

mongoose.model('cart', cartSchema);