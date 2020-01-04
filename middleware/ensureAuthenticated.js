const jwtVerify = require('../lib/jwtVerify');

module.exports = function ensureAuthenticated(config) {
    return function (req, res, next) {
        return jwtVerify(req, res, next, config, false);
    }
}