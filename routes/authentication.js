const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/UserModel');

class Authentication {

    constructor(configuration) {
        this.config = configuration;
        this.addRoutes = this.addRoutes.bind(this);
        this.ensureAuthenticated = this.ensureAuthenticated.bind(this);
        this.ensureAuthenticatedAndRedirect = this.ensureAuthenticatedAndRedirect.bind(this);

        this.router = express.Router();
        this.addRoutes();
    }

    addRoutes() {
        this.router.post('/register', (req, res) => {
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
                            errors.push({ msg: 'User already exists' });
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

        this.router.post('/login', (req, res) => {
            let { email, password = '' } = req.body;

            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        res.json({ errors: [{ msg: 'user does not exist!' }] });
                    }
                    else if (user) {
                        let validPass = user.comparePassword(password);
                        if (!validPass) {
                            res.json({ status: false, errors: [{ msg: 'wrong password!' }] });
                        }
                        else if (validPass) {
                            let token = jsonwebtoken.sign({ email: email }, this.config.jwtSecret, { expiresIn: this.config.jwtExpireTime });
                            res.cookie('checksum', token, { httpOnly: true, maxAge: this.config.cookieMaxAge });
                            res.json({ status: true, redirect: '/' });
                        }
                    }
                })
                .catch(err => console.log(err));
        });
    }

    ensureAuthenticated(req, res, next) {
        let cookies = req.cookies || {};
        let checksum = cookies.checksum;
        jsonwebtoken.verify(checksum, this.config.jwtSecret, (err, data) => {
            if (err) {
                res.json({ redirect: '/login' });
            }
            else if (data) {
                res.locals.user = {
                    email: data.email
                };
                return next();
            }
            else {
                res.json({ redirect: '/login' });
            }
        });
    }

    ensureAuthenticatedAndRedirect(req, res, next) {
        let cookies = req.cookies || {};
        let checksum = cookies.checksum;
        jsonwebtoken.verify(checksum, this.config.jwtSecret, (err, data) => {
            if (err) {
                res.redirect('/login');
            }
            else if (data) {
                res.locals.user = {
                    email: data.email
                };
                return next();
            }
            else {
                res.redirect('/login');
            }
        });
    }

}

module.exports = Authentication;