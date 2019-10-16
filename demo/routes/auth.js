const express = require('express');
const User = require('../models/UserModel');

const router = express.Router();

router.post('/register', (req, res) => {
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
        res.send({
            errors
        });
    }
    else {
        //save user
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'User already exists' });
                    res.send({
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
                            res.send({ status: true });
                        })
                        .catch(err => console.log(err));

                }
            });
    }
});

router.post('/login', (req, res) => {
    let { email, password = '' } = req.body;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                res.send({ errors: [{ msg: 'user does not exist!' }] });
            }
            else if (user) {
                let validPass = user.comparePassword(password);
                if (!validPass) {
                    res.json({ status: false, errors: [{ msg: 'wrong password!' }] });
                }
                else if (validPass) {
                    // create jwt and set cookie
                    res.json({ status: true });
                }
            }
        })
        .catch(err => console.log(err));
});

module.exports = router;