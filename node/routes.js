const express = require('express');
const router = express.Router();
const passport = require('passport');

const mongoose = require('mongoose');
const userModel = mongoose.model('user');
const productModel = mongoose.model('product');
const cartModel = mongoose.model('cart');
const orderModel = mongoose.model('order');

router.route('/login').post((req, res, next) => {
    if(req.body.username, req.body.password) {
        passport.authenticate('local', function(error, user) {
            if(error) return res.status(500).send(error);
            req.login(user, function(error) {
                if(error) return res.status(500).send(error);
                return res.status(200).send('Bejelentkezes sikeres');
            })
        })(req, res);
    } else {
        return res.status(400).send('Hibas keres, username es password kell');
    }
});

router.route('/logout').post((req, res, next) => {
    if(req.isAuthenticated()) {
        req.logout();
        return res.status(200).send('Kijelentkezes sikeres');
    } else {
        return res.status(403).send('Nem is volt bejelentkezve');
    }
})

router.route('/status').get((req, res, next) => {
    if(req.isAuthenticated()) {
        return res.status(200).send(req.session.passport);
    } else {
        return res.status(403).send('Nem is volt bejelentkezve');
    }
    
})

router.route('/user').get((req, res, next) => {
    userModel.find({}, (err, users) => {
        if(err) return res.status(500).send('DB hiba');
        res.status(200).send(users);
    })
}).post((req, res, next) => {
    if(req.body.username && req.body.email && req.body.password) {
        userModel.findOne({username: req.body.username}, (err, user) => {
            if(err) return res.status(500).send('DB hiba');
            if(user) {
                return res.status(400).send('Hiba, mar letezik ilyen felhasznalonev');
            }
            const usr = new userModel({username: req.body.username, password: req.body.password, 
                email: req.body.email, accessLevel: req.body.accessLevel});
            usr.save((error) => {
                if(error) return res.status(500).send('A ment??s sor??n hiba t??rt??nt');
                return res.status(200).send('Sikeres mentes tortent');
            })
        })
    } else {
        return res.status(400).send('Hibas keres, username, email es password kell');
    }
})


//product

router.route('/product').get((req, res, next) => {
    productModel.find({}, (err, data) => {
        if(err) return res.status(500).send('DB hiba');
        res.status(200).send(data);
    })
}).post((req, res, next) => {
    if(req.body.name && req.body.price && req.body.description && req.body.quantity) {
        productModel.findOne({name: req.body.name}, (err, data) => {
            if(err) return res.status(500).send('DB hiba');
            if(data) {
                return res.status(400).send('m??r van ilyen product');
            } else {
                const example = new productModel({name: req.body.name, description: req.body.description, price: req.body.price, quantity: req.body.quantity});
                example.save((error) => {
                    if(error) return res.status(500).send('A mentes soran hiba tortent');
                    return res.status(200).send('Sikeres mentes tortent');
                })
            }
        })
    } else {
        return res.status(400).send('Nem volt id vagy value');
    }
}).put((req, res, next) => {
    if(req.body.product) {
        productModel.findOne({name: req.body.product.name}, (err, data) => {
            if(err) return res.status(500).send('DB hiba');
            if(data) {
                if(req.body.product.description) {
                    data.description = req.body.product.description;
                }
                if(req.body.product.price) {
                    data.price = req.body.product.price;
                }
                data.quantity = req.body.product.quantity;
                data.save((error) => {
                    if(error) return res.status(500).send('A mentes soran hiba tortent');
                    return res.status(200).send('Sikeres mentes tortent');
                })
            } else {
                return res.status(400).send('Nincs ilyen id az adatbazisban');
            }
        })
    } else {
        return res.status(400).send('Nem volt id vagy value');
    }
}).delete((req, res, next) => {
    if(req.body.name) {
        productModel.findOne({name: req.body.name}, (err, data) => {
            if(err) return res.status(500).send('DB hiba: '+err);
            if(data) {
                data.delete((error) => {
                    if(error) return res.status(500).send('A torles soran hiba tortent: '+error);
                    return res.status(200).send('Sikeres torles tortent');
                })
            } else {
                return res.status(400).send('Nincs ilyen id az adatb??zisban');
            }
        })
    } else {
        return res.status(400).send('Nem volt nev');
    }
})

//cart

router.route('/cart/:username').get((req, res, next) => {
    cartModel.find({username: req.query.username}, (err, data) => {
        if(err) return res.status(500).send('DB hiba');
        res.status(200).send(data);
    }, err => {
        console.log('Nincs ilyen user kosar!');
    })
}).post((req, res, next) => {
    if(req.body.username) {
        cartModel.findOne({username: req.body.username, product: req.body.product}, (err, data) => {
            if(err) return res.status(500).send('DB hiba: '+err);
            if(data) {
                return res.status(400).send('mar van ilyen kosar: ' + req.body.username);
            } else {
                const example = new cartModel({username: req.body.username, product: req.body.product});
                example.save((error) => {
                    if(error) return res.status(500).send('A mentes soran hiba tortent: '+error);
                    return res.status(200).send('Sikeres mentes tortent');
                })
            }
        })
    } else {
        return res.status(400).send('Nem volt username vagy product');
    }
}).put((req, res, next) => {
    if(req.body.username && req.body.product) {
        cartModel.findOne({username: req.body.username}, (err, data) => {
            if(err) return res.status(500).send('DB hiba');
            if(data) {
                data.product = req.body.product;
                data.save((error) => {
                    if(error) return res.status(500).send('A mentes soran hiba tortent');
                    return res.status(200).send('Sikeres mentes tortent');
                })
            } else {
                return res.status(400).send('Nincs ilyen id az adatbazisban');
            }
        })
    } else {
        return res.status(400).send('Nem volt id vagy value');
    }
}).delete((req, res, next) => {
    if(req.query.username && req.query.product) {
        cartModel.findOne({username: req.query.username}, (err, data) => { 
            if(err) return res.status(500).send('DB hiba');
            if(req.query.product) {
                for(prod in data.product) {
                    if(prod.name == req.query.product.name){
                        //del
                        prod.delete((error) => {
                            if(error) return res.status(500).send('A torles soran hiba tortent');
                            return res.status(200).send('Sikeres torles tortent');
                        })
                    }
                }

                return res.status(400).send('Nem talalhato ilyen kosarelem');
            } else {
                return res.status(400).send('Nincs ilyen username az adatb??zisban');
            }
        })
    } else {
        return res.status(400).send('Nem volt user vagy product nev!');
    }
})

//order

router.route('/order/:username').get((req, res, next) => {
    orderModel.find({username: req.query.username}, (err, data) => {
        if(err) return res.status(500).send('DB hiba');
        res.status(200).send(data);
    })
}).post((req, res, next) => {
    if(req.body.username) {
        orderModel.findOne({username: req.body.username}, (err, data) => {
            if(err) return res.status(500).send('DB hiba');
            const order = new orderModel({username: req.body.username, product: req.body.product});
            order.save((error) => {
                if(error) return res.status(500).send('A mentes soran hiba tortent: '+ error);
                return res.status(200).send('Sikeres mentes tortent');
            })

        })
    } else {
        return res.status(400).send('Nem volt username vagy product');
    }
}).put((req, res, next) => {
    if(req.body.username) {
        orderModel.findOne({username: req.body.username}, (err, data) => {
            if(err) return res.status(500).send('DB hiba');
            data.product = req.body.product;
            data.save((error) => {
                if(error) return res.status(500).send('A mentes soran hiba tortent');
                return res.status(200).send('Sikeres mentes tortent');
            })
        })
    } else {
        return res.status(400).send('Nem volt ilyen order meg!');
    }
}).delete((req, res, next) => {
    if(req.body.name) {
        orderModel.findOne({username: req.body.username}, (err, data) => {
            if(err) return res.status(500).send('DB hiba');
            if(data) {
                data.delete((error) => {
                    if(error) return res.status(500).send('A torles soran hiba tortent');
                    return res.status(200).send('Sikeres torles tortent');
                })
            } else {
                return res.status(400).send('Nincs ilyen username az adatb??zisban');
            }
        })
    } else {
        return res.status(400).send('Nem volt usernev');
    }
})


module.exports = router;