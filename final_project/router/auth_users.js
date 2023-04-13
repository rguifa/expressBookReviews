const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });

  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password){
    return res.status(404).json({message: "Error loging in"});
  }

  if( authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({message: "User succesfully logged in"});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const reviewText = req.query.review
  const book = books[isbn];

  if (!reviewText){
    return res.status(400).json({error: "Review text is required"});
  }

  if (!book){
    res.status(404).json({message: " Book not found!"});
    return;
  }
  // Check if there is a review from current user for the book
  if( book.reviews && book.reviews[username] ){
    // If tehre is a review, modify it
    book.reviews[username] = reviewText;
    res.status(200).json({message: "Review modified successfully"});
  } else {
      book.reviews[username] = reviewText;
      res.status(200).json({message: "Review added successfully"});
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const book = books[isbn];

  // Check if the book exists
  if (!book) {
    return res.status(404).json({message: "Book not found!"});
  }

  // Check if there are reviews or if there is a review by current user
  if (!book.reviews || !book.reviews[username]) {
    return res.status(401).json({message: "Unauthorized"});
  }

  // Delete de review for this book and current user
  delete book.reviews[username];
  res.status(204).send();
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
