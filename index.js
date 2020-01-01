const router = require('./routes/authentication').router;
const ensureAuthenticated = require('./routes/authentication').ensureAuthenticated;
const ensureAuthenticatedAndRedirect = require('./routes/authentication').ensureAuthenticatedAndRedirect;

module.exports = {
    router,
    ensureAuthenticated,
    ensureAuthenticatedAndRedirect,
}