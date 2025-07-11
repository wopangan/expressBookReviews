const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Complete the code for registering new user
// this is connected to auth_users.js -> isValid
public_users.post("/register", (req,res) => {
  const {username, password} = req.body;

  // The code should take the ‘username’ and ‘password’ provided in the body of the request for registration. 
  // If the username already exists, it must mention the same & must also show other errors like 
  // eg. when username &/ password are not provided.

  if (!username && !password) {
    return res.status(400).json({ message: "Please fill up your username and password."});
  }

  if (!isValid(username)) {
    // if the username & password are provided and valid,
    users.push({ "username": username, "password": password});
    return res.status(200).json({ message: "Registered successfully"});
  } else {
    return res.status(400).json({ message: "Username already exists!"});
  }

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
  let results = []; // to collect and store all the books written by the searched author

  // loop through the books and check for matching author
  keys.forEach(key => {
    if (books[key].author.toLowerCase() === author) {
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

// Task 4: Get all books based on title 
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  // const keys = Object.keys(books);
  let results = [];

  // keys.forEach(key => {
  //   if (books[key].title.toLowerCase() === title) {
  //     results.push(books[key]);
  //   }
  // });

  // in other approach

  for (const key in books) {
    if (books[key].title.toLowerCase() === title) {
      results.push(books[key])
    }
  }

  // check if title of the books exists
  if (results.length > 0) {
    res.send(results);
  } else {
    res.status(404).json({ message: "Title not found"});
  }
});

//  Task 5: Get book review based on ISBN
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (isbn && books[isbn]) {
    const bookReview = books[isbn].reviews;
    return res.send(bookReview);
  } else {
    res.status(404).json({ message: "Book review not found"});
  }

});

module.exports.general = public_users;
