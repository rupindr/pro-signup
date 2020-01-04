const Authentication = require('./lib/Authentication');
const defaultConfig = require('./config/config');

module.exports = function (configuration) {
    const config = {
        ...configuration,
        ...defaultConfig,
    };

    if (!config.jwtSecret) {
        throw new Error('jwtSecret is required in pro-signup configuration');
    }

    return new Authentication(config);
}