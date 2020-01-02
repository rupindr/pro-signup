# pro-signup  
  
Authentication [module](https://www.npmjs.com/package/pro-signup) for [express](https://github.com/expressjs/express) server  
## Quick Start  
Install pro-signup module  
```
    npm install pro-signup --save
```  
Integrate with your express application  
```
    const express = require('express')
    const proSignup = require('pro-signup')({
        jwtSecret: process.env.jwtSecret
    })
    const app = express()

    // connect to mongodb here

    app.get('/auth', proSignup.router)
    app.get('/users', proSignup.ensureAuthenticated, function (req, res) {
        res.send('some private data behind authentication')
    })
    app.get('/', function (req, res) {
        res.send('some public data without authentication')
    })

    app.listen(3000)
```