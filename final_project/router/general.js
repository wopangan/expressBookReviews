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

// Task 10: Modify by using Promise callbacks or async-await with Axios.
// Task 1: Get the book list available in the shop
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

// Task 11: Get book details based on ISBN using Promises callbacks or async-await with Axios
// Task 2: Get book details based on ISBN
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

// Task 12: Get book details based on author using Promise callbacks or async-await with Axios
// Task 3: Get book details based on author
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

// Task 13: Get book details based on title using Promise callbacks or async-await with Axios
// Task 4: Get book details based on title 
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
