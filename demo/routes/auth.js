const express = require('express');

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
            errors,
            name,
            email
        });
    }
    else {
        //save user
        res.send({status: 'ok'});
    }
});

module.exports = router;