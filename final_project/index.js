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

// Enable sessions for customer routes
app.use("/customer",session({
    secret: SESSION_SECRET,
    resave: true, 
    saveUninitialized: true
}));

// Middleware to authorize routes.
// Verifies the user's JWT token stored in the session.
app.use("/customer/auth/*", function auth(req,res,next){
    const sessionAuth = req.session.authorization;

    if (sessionAuth) {
        const token = sessionAuth['accessToken'];

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (!err) {
                res.user = decoded;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated or expired token."});
            }   
        });
    } else {
        return res.status(401).json({ message: "You must be logged in."});
    }
});
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
