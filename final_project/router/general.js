const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Task 1: Get the book list available in the shop
public_users.get('/books',function (req, res) {
  res.send(JSON.stringify(books))
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const id = req.params.isbn;

  // checks if id is provided and if the book exists in the 'books'.
  if (id && books[id]) {
    const bookDetails = books[id]
    return res.send(bookDetails);
  } else {
    res.status(404).json({ message: "No book found"})
  }
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books); // get all the keys
  let results = []; // to collec and store all the books written by the searched author

  // loop through the books and check for matching author
  keys.forEach(key => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      results.push(books[key]);
    }
  })

  // check if author exists
  if (results.length > 0 ) {
    res.send(results)
  } else {
    res.status(404).json({message: "Author not found"});
  }
});

// To be continued...
// Task 4: Get all books based on title 
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
