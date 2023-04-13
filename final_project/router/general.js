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
  getBooks().then((bks) => {
    res.send(JSON.stringify(bks, 4));
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  getBooksByISBN(isbn).then((book) =>
    res.send(JSON.stringify(book, 4)),
    (error) => {
      return res.status(404).json({message: error})
    }) 
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  
  getBooksByAuthor(author).then((books) =>
    res.send(JSON.stringify(books, 4)),
    (error) => {
      return res.status(404).json({message: error})
    }
  )
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  // const filtered_books = Object.values(books).filter((book) => book.title.toLowerCase() === title);
  // res.send(JSON.stringify(filtered_books, 4)); 
  getBooksByTitle(title).then((books) =>
    res.send(JSON.stringify(books, 4)),
    (error) => {
      return res.status(404).json({message: error})
    }
  )
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

//Task 10 Add the code for getting the list of books available in the shop using Promise callbacks or async-await with Axios.
function getBooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Task 11 Add the code for getting the book details based on ISBN using Promise callbacks or async-await with Axios.
function getBooksByISBN(isbn) {
  const book = books[isbn];
  return new Promise((resolve, reject) => {
    if(!book) {
      reject("Book not found");
    } else {
      resolve(book);
    }
  });
}

// Task 12 Add the code for getting the book details based on Author using Promise callbacks or async-await with Axios.
function getBooksByAuthor(author) {
  const filtered_books = Object.values(books).filter((book) => book.author.toLowerCase() === author);
  return new Promise((resolve, reject) => {
    if(filtered_books.length > 0){
      resolve(filtered_books)
    } else {
      reject("Books not found")
    }
  }
)};

// Task 13 Add the code for getting the book details based on Title using Promise callbacks or async-await with Axios.
function getBooksByTitle(title) {
  const filtered_books = Object.values(books).filter((book) => book.title.toLowerCase() === title);
  return new Promise((resolve, reject) => {
    if(filtered_books.length > 0){
      resolve(filtered_books)
    } else {
      reject("Books not found")
    }
  }
)};



module.exports.general = public_users;
