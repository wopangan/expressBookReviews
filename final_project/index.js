require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(express.json());

app.use("/customer",session({
    secret: SESSION_SECRET,
    resave: true, 
    saveUninitialized: true
}));

// Update the authentication code with session authorization feature
app.use("/customer/auth/*", function auth(req,res,next){

    // check if user has logged in and has valid access token
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // verify jwt token
        jwt.verify(token, JWT_SECRET, (err, res) => {
            if (!err) {
                res.user = user;
                next();
            } else{
                return res.status(404).json({ message: "User not authenticated."});
            }   
        });
    } else {
        return res.status(404).json({ message: "User not logged in."});
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
