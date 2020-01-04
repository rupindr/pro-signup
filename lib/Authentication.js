const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const ensureAuthenticatedAndRedirect = require('../middleware/ensureAuthenticatedAndRedirect');
const authRouter = require('../routes/auth-router');

class Authentication {

    constructor(configuration) {
        this.ensureAuthenticated = ensureAuthenticated(configuration);
        this.ensureAuthenticatedAndRedirect = ensureAuthenticatedAndRedirect(configuration);

        this.router = authRouter(configuration);
    }

}

module.exports = Authentication;