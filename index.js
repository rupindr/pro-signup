const router = require('./routes/authentication').router;
const ensureAuthenticated = require('./routes/authentication').ensureAuthenticated;

module.exports = {
    router,
    ensureAuthenticated,
}