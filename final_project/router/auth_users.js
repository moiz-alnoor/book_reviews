const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require("express-session");
const regd_users = express.Router();
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || "my-secret-key";

let users = [];


const app = express();

app.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use 'true' if HTTPS is enabled
}));

const isValid = (credential) => {
  console.log(credential)
  if (credential === '' || credential === null || credential === undefined) {
    return false
  }
  else
    return true
}


const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  if (!isValid(username)) {
    return res.status(400).json({ message: "username not valid" });
  } if (!isValid(password)) {
    return res.status(400).json({ message: "password not valid" });
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  console.log(req.body.password)
  const { username, password } = req.body;
  req.session.username = username;
  const token = jwt.sign({ username }, SECRET_KEY, {
    expiresIn: "1h", // Token expires in 1 hour
  });

  // Send the token to the client
  return res.status(200).json({
    message: "Login successful",
    token,
  });

});

// Add a book review
regd_users.put("/auth/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body; // Get the review from the request query
  const username = req.session.username; // Assuming the username is stored in the session

  console.log(isbn, review, username)
  return res.status(300).json({ message: "Yet to be implemented" });
});

regd_users.delete("/auth/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  console.log(req, isbn)
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
