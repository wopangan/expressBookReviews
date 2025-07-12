const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

let users = [];

const isValid = (username) => { //returns boolean
  // check if the username is valid
  let usersWithSameName = users.filter(user => user.username === username);

  if (usersWithSameName.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password) => { //returns boolean
  // check if username and password match the one we have in records.
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
    return res.status(400).json({ message: "Username and password are required."});
  }

  // Authenticate user and generate jwt token for the user 
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, JWT_SECRET, {expiresIn: 60 }); // session expires in 60 seconds.

    // store access token and username in session
    req.session.authorization = {accessToken};
    req.session.username = username; 
    return res.status(200).json({ message: "User successfully logged in!"});
  } else {
    return res.status(400).json({ message: "Invalid login. Please check you username and password."})
  }
});

// Task 8: Complete the code for adding or modifying a book review.
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

  // if book not found
  return res.status(404).json({ message: "Book does not exist."});
});

// Task 9: Complete the code for deleting a book review
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
module.exports.isValid = isValid;
module.exports.users = users;
