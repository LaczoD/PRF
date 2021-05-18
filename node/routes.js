const express = require('express');
const router = express.Router();
const passport = require('passport');

const mongoose = require('mongoose');
const exampleModel = mongoose.model('example');
const userModel = mongoose.model('user');

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
                email: req.body.email});
            usr.save((error) => {
                if(error) return res.status(500).send('A mentés során hiba történt');
                return res.status(200).send('Sikeres mentes tortent');
            })
        })
    } else {
        return res.status(400).send('Hibas keres, username, email es password kell');
    }
})

router.route('/example').get((req, res, next) => {
    exampleModel.find({}, (err, examples) => {
        if(err) return res.status(500).send('DB hiba');
        res.status(200).send(examples);
    })
}).post((req, res, next) => {
    if(req.body.id && req.body.value) {
        exampleModel.findOne({id: req.body.id}, (err, example) => {
            if(err) return res.status(500).send('DB hiba');
            if(example) {
                return res.status(400).send('már van ilyen id');
            } else {
                const example = new exampleModel({id: req.body.id, value: req.body.value});
                example.save((error) => {
                    if(error) return res.status(500).send('A mentés során hiba történt');
                    return res.status(200).send('Sikeres mentes tortent');
                })
            }
        })
    } else {
        return res.status(400).send('Nem volt id vagy value');
    }
}).put((req, res, next) => {
    if(req.body.id && req.body.value) {
        exampleModel.findOne({id: req.body.id}, (err, example) => {
            if(err) return res.status(500).send('DB hiba');
            if(example) {
                example.value = req.body.value;
                example.save((error) => {
                    if(error) return res.status(500).send('A mentés során hiba történt');
                    return res.status(200).send('Sikeres mentes tortent');
                })
            } else {
                return res.status(400).send('Nincs ilyen id az adatbázisban');
            }
        })
    } else {
        return res.status(400).send('Nem volt id vagy value');
    }
}).delete((req, res, next) => {
    if(req.body.id) {
        exampleModel.findOne({id: req.body.id}, (err, example) => {
            if(err) return res.status(500).send('DB hiba');
            if(example) {
                example.delete((error) => {
                    if(error) return res.status(500).send('A mentés során hiba történt');
                    return res.status(200).send('Sikeres torles tortent');
                })
            } else {
                return res.status(400).send('Nincs ilyen id az adatbázisban');
            }
        })
    } else {
        return res.status(400).send('Nem volt id');
    }
})

module.exports = router;