const jwtVerify = require('../lib/jwtVerify');

module.exports = function ensureAuthenticatedAndRedirect(config) {
    return function (req, res, next) {
        return jwtVerify(req, res, next, config, true);
    }
}