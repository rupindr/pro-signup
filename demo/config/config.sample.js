const config = {
    dbUrl: 'mongodb://random:db@url.mlab.com:35252/dbname',
    jwtSecret: 'isitgiforgif',
    jwtExpireTime: '168h',
    cookieMaxAge: 7*24*60*60*1000,
};

module.exports=config;