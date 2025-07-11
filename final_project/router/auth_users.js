const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check if the username is valid
  let usersWithSameName = users.filter(user => user.username === username);

  if (usersWithSameName.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password) => { //returns boolean
//write code to check if username and password match the one we have in records.
  const userMatch = users.filter(user => user.username === username && user.password === password)

  if (userMatch.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Task 7: Complete the code for logging in as a registered user
// connect authenticatedUser()
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in!"});
  }

  // Authenticate user and generate jwt token for the user 
  if (authenticatedUser(username,password)) {
    // sign jwt
    let accessToken = jwt.sign({ data: password }, JWT_SECRET, {expiresIn: 60 }); // session expires in 60 seconds.

    // store access token and username in session
    req.session.authorization = {accessToken, username};
    return res.status(200).send("User successfully logged in!");
  } else {
    return res.status(400).send("Invalid login. Please check you username and password.")
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
