const express = require('express');
let books = require("./booksdb.js");
let isUsernameTaken = require("./auth_users.js").isUsernameTaken;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user if the username is not taken
// Connected to auth_users.js and registered in index.js
public_users.post("/register", (req,res) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please fill up your username and password."});
  }

  if (!isUsernameTaken(username)) {
    users.push({ "username": username, "password": password});
    return res.status(200).json({ message: "Registered successfully"});
  } else {
    return res.status(400).json({ message: "Username is taken."});
  }
});

// Get the list of all boks (simulated using Promises)
public_users.get('/books', function (req, res) {
  new Promise((resolve) =>{
    setTimeout(() => { 
      resolve(books) 
    }, 500);
  })
  .then((bookList) => {
    res.json(bookList);
  })
  .catch(() => {
    res.status(500).json({ message: "Failed to fetch books data."})
  })
});

// Get book details based on ISBN (simulated using Promises)
public_users.get('/isbn/:isbn', function (req, res) {
  const id = req.params.isbn;
  
  new Promise((resolve) => {
    setTimeout(() => { 
      resolve(books) 
    }, 500);
  })
  .then(() => {
    if (id && books[id]) {
      const book = books[id]
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found."})
    }
  })
  .catch(() => {
    res.status(500).json({ message: "Failed to fetch book data."})
  })
});

// Get book details based by author name (simulated using async-await)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books); // get all the keys
  let results = []; // to collect and store all the books written by the searched author

  try {
    const bookList = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 500)
    });
    // loop through the books and check for matching author
    keys.forEach(key => {
      if (bookList[key].author.toLowerCase() === author.toLowerCase()) {
        results.push(bookList[key]);
      }
    });
    // check if author exists
    if (results.length > 0 ) {
      res.send(results);
    } else {
      res.status(404).json({message: "Author not found"});
    }

  } catch {
    res.status(500).json({ message: "Failed to fetch book data." });
  }
});

// Get book details by title (simulated using async-await)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  let results = [];

  try {
    const bookList = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 500);
    });

    for (const key in bookList) {
      if (bookList[key].title.toLowerCase() === title.toLowerCase()) {
        results.push(bookList[key]);
      } 
    }

    // check if book title exists
    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ message: "Title not found"});
    }
  } catch {
    res.status(500).json({ message: "Failed to fetch book data." });
  }
});

//  Get book review/s based on ISBN
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
