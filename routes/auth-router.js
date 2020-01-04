const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/UserModel');

function checkConnection(req, res, next) {
    if (mongoose.connection.readyState != 1) {
        console.error('not connected! \npro-signup requires a mongodb connection to work');
        res.sendStatus(500);
    }
    next();
}

module.exports = function(config){
    const router = express.Router();

    router.post('/register', checkConnection, (req, res) => {
        let { name, email, password = '', password2 } = req.body;
        let errors = [];

        if (!name || !email || !password || !password2) {
            errors.push({ msg: 'Please fill all the fields' });
        }

        if (password2 !== password) {
            errors.push({ msg: 'Passwords do not match' });
        }

        if (password.length < 6) {
            errors.push({ msg: 'Passwords must be atleast 6 characters' });
        }

        if (errors.length > 0) {
            res.json({
                errors
            });
        }
        else {
            //save user
            User.findOne({ email: email })
                .then(user => {
                    if (user) {
                        errors.push({ msg: 'email already in use' });
                        res.json({
                            errors
                        });
                    }
                    else {
                        const newUser = new User({
                            name,
                            email,
                            password
                        });

                        newUser.save()
                            .then(user => {
                                res.json({ status: true, redirect: '/login' });
                            })
                            .catch(err => console.log(err));

                    }
                });
        }
    });

    router.post('/login', checkConnection, (req, res) => {
        let { email, password = '' } = req.body;

        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    res.json({ status: false, errors: [{ msg: 'wrong username or password!' }] });
                }
                else if (user) {
                    let validPass = user.comparePassword(password);
                    if (!validPass) {
                        res.json({ status: false, errors: [{ msg: 'wrong username or password!' }] });
                    }
                    else if (validPass) {
                        let token = jsonwebtoken.sign({ email: email }, config.jwtSecret, { expiresIn: config.jwtExpireTime });
                        res.cookie('checksum', token, { httpOnly: true, maxAge: config.cookieMaxAge });
                        res.json({ status: true, redirect: '/' });
                    }
                }
            })
            .catch(err => console.log(err));
    });

    return router;
}