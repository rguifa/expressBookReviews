const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password){
    if(!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  const filtered_books = Object.values(books).filter((book) => book.author.toLowerCase() === author);
  res.send(JSON.stringify(filtered_books, 4)); 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  const filtered_books = Object.values(books).filter((book) => book.title.toLowerCase() === title);
  res.send(JSON.stringify(filtered_books, 4)); 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  // Check if book exists
  if(!books[isbn]){
    res.status(404).send('No records found');
    return;
  }
  
  const bookReviews = books[isbn].reviews;
  res.send(JSON.stringify(bookReviews, 4));
  
});

module.exports.general = public_users;
