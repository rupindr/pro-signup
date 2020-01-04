const jsonwebtoken = require('jsonwebtoken');

module.exports = function (req, res, next, config, needRedirection) {
    let cookies = req.cookies || {};
    let checksum = cookies.checksum;
    jsonwebtoken.verify(checksum, config.jwtSecret, (err, data) => {
        if (err || !data) {
            if (needRedirection) {
                res.redirect('/login');
            }
            else {
                res.json({ redirect: '/login' });
            }
        }
        else {
            res.locals.user = {
                email: data.email
            };
            return next();
        }
    });
}