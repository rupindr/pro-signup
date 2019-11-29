const express = require('express');

const router = express.Router();

router.post('/data', (req, res) => {
    res.json({ data: 'okay ' + res.locals.user.email });
});

module.exports = router;