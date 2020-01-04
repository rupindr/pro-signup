# pro-signup  
  
Authentication [module](https://www.npmjs.com/package/pro-signup) for [express](https://github.com/expressjs/express)  

## What is ProSignup?

ProSignup is a node module that handles the user authentication for express applications. It adds two REST APIs ```POST: /login and POST: /register``` and creates a collection ```User``` in MongoDB to manage users.

## Quick Start  
### Prerequisites
* A working Express application ([getting started with express](https://expressjs.com/en/starter/hello-world.html))
* MongoDB connection created using [Mongoose](https://mongoosejs.com/)

### Usage
1. Install pro-signup module  
```
    npm install pro-signup --save
```  
2. Integrate with your express application  
```javascript
    const express = require('express')
    const proSignup = require('pro-signup')({
        jwtSecret: process.env.jwtSecret
    })
    const app = express()

    // connect to MongoDB here

    app.use('/auth', proSignup.router)
    app.get('/profile', proSignup.ensureAuthenticated, function (req, res) {
        let email = res.locals.user.email;
        res.send('some private data for user ' + email);
    })
    app.get('/', function (req, res) {
        res.send('some public data without authentication')
    })

    app.listen(3000)
```

### Verifying that it works
```
GET: http://localhost:9000/                 RESPONSE: some public data without authentication
GET: http://localhost:9000/profile          RESPONSE: { "redirect": "/login" }
```
```
POST /auth/register HTTP/1.1
Host: localhost:9000
Content-Type: application/x-www-form-urlencoded

name=user1&password=thisispassword123!&password2=thisispassword123!&email=user1@email.com
```
```
POST /auth/login HTTP/1.1
Host: localhost:9000
Content-Type: application/x-www-form-urlencoded

password=thisispassword123!&email=user1@email.com
```
and after logging in:
```
GET: http://localhost:9000/profile          RESPONSE: some private data for user user2@email.com
```
## Detailed Guide

### User Model

ProSignup creates a new collection with following fields in MongoDB
```javascript
{
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String, //hashed
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
}
```

### Configuration
You need to provide a JSON object with configuration for it to work.
```javascript
const proSignup = require('pro-signup')({
    //configuration parameters
})
```
#### Configuration parameters
* **jwtSecret** is a required parameter. It is used as the secret while signing [json-web-tokens](https://www.npmjs.com/package/jsonwebtoken) that are sent to the client. JWT is stored as a cookie on the client machine and that token is used to authenticate the user.

### Methods
* **proSignup.router** is ```express.Router()``` instance with REST APIs endpoints configured. You need to use it as ```app.use('/basepath', proSignup.router)```  
    This adds ```/basepath/login``` and ```/basepath/register``` routes to the app. These are discussed in detail further down in this guide.

* **proSignup.ensureAuthenticated** is a middleware function. It checks if the user is logged in or not. If the user is logged in it adds ```res.locals.user``` to the response which can be used by the actual route to get user info.
If the user is not logged in it responds with ```{ "redirect": "/login" }```. The client can then use this information to redirect to the login page. Usages:  

```javascript
app.get('/protected-route', proSignup.ensureAuthenticated, function (req, res) {
    let email = res.locals.user.email;
    res.send('some private data for user ' + email);
})
```
```javascript
app.use('/protected-routes', proSignup.ensureAuthenticated, someRouterInstance)
```

* **proSignup.ensureAuthenticatedAndRedirect** is similar to ```ensureAuthenticated```. Difference it that it actually redirects to '/login' instead of leaving it to client.

### REST APIs
#### /register

```
POST /basename/register HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=name of the user&password=thisispassword123!&password2=thisispassword123!&email=useremail@domain.com
```
on success
```javascript
{
    "status": true,
    "redirect": "/login"
}
```
on error
```javascript
{
    "errors": [
        {
            "msg": "error description"
        },
        ...
    ]
}
```
#### /login
```
POST /auth/login HTTP/1.1
Content-Type: application/x-www-form-urlencoded

password=thisispassword123!&email=useremail@domain.com
```
on success ( plus sets a cookie 'checksum=jsonwebtoken' )
```javascript
{
    "status": true,
    "redirect": "/"
}
```
on error
```javascript
{
    "errors": [
        {
            "msg": "error description"
        },
        ...
    ]
}
```

## Upcoming features
* Make following parameters customizable:
    * json-web-token expiration time
    * /login and /register route pathname
* stronger password requirements
* logout functionality