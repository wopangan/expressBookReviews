const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

let users = [];

// Check if a username is already taken.
// Returns true if the username exists in the users array.
const isUsernameTaken = (username) => {
  let usersWithSameName = users.filter(user => user.username === username);

  if (usersWithSameName.length > 0){
    return true;
  } else {
    return false;
  }
}

// Authenticates a user by checking if username and password match any record.
const authenticatedUser = (username,password) => {
  // Check if the provided username and password match any existing user record.
  const userMatch = users.filter(user => user.username === username && user.password === password)

  if (userMatch.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Logs in a registered user.
// Generates a JWT token for the user and stores it in a session.
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required."});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, JWT_SECRET, {expiresIn: 60 }); // session expires in 60 seconds.

    req.session.authorization = {accessToken};
    req.session.username = username; 
    return res.status(200).json({ message: "User successfully logged in!"});
  } else {
    return res.status(400).json({ message: "Invalid login. Please check you username and password."})
  }
});

// Adds or modifies a book review for the logged-in user.
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const username = req.session.username;
  const id = req.params.isbn;

  // Check if the book exists
  if (id && books[id]) {
    const reviewExists = books[id].reviews[username] !== undefined;

    books[id].reviews[username] = review;

    const message = reviewExists 
      ? "Your review has been updated" 
      : "Your review has been added.";

    return res.status(200).json({ message });
  }

  return res.status(404).json({ message: "Book does not exist."});
});

// Deletes a book review posted by the logged-in user.
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;
  const id = req.params.isbn;
  
  if (!books[id].reviews[username]) {
    return res.status(404).json({ message: "No review found for this user."})
  }

  delete books[id].reviews[username];
  res.status(200).json({ message: "Your review has been removed."})
});

module.exports.authenticated = regd_users;
module.exports.isUsernameTaken = isUsernameTaken;
module.exports.users = users;
