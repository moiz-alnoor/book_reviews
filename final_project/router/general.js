const express = require('express');
let books = require("./booksdb.js");
const fs = require('fs').promises;
const path = require('path');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  console.log(req)
  if (!isValid(req.body.username)) {
    return res.status(400).json({ message: "username not provided" });
  } if (!isValid(req.body.password)) {
    return res.status(400).json({ message: "password not provided" });
  }

  return res.status(201).json({ message: "user has registered" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(300).json({ message: books });
});


// Define the callback function, Get the book list available in the shop
function getBooksCallback(req, res) {
  // Assuming 'books' is a predefined list of books
  return res.status(300).json({ message: books });
}

// Use the callback in the route, Get the book list available in the shop
public_users.get('/', getBooksCallback);

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = Number(req.params.isbn);
  return res.status(300).json({ message: books[isbn] });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorName = req.params.author.toLocaleLowerCase();
  const booksByAuthor = Object.values(books).filter(book =>
    book.author.toLowerCase() === authorName
  );

  return res.status(300).json({ message: booksByAuthor });
});

// Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
  const authorName = req.params.author.toLowerCase();

  try {
    // Read the local books.json file asynchronously
    const data = await fs.readFile(path.join(__dirname, 'books.json'), 'utf-8');

    // Parse the file data to JSON
    const books = JSON.parse(data);

    // Filter the books based on the author's name (case-insensitive)
    const booksByAuthor = Object.values(books).filter(book =>
      book.author.toLowerCase() === authorName
    );

    // Return the books written by the specified author
    res.status(200).json({ message: booksByAuthor });
  } catch (err) {
    // Handle any file reading errors
    console.error("Error reading books file:", err);
    res.status(500).json({ message: 'Error reading books file' });
  }
});

// Define the route to get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    // Use fs.promises.readFile to read the local books.json file asynchronously
    const data = await fs.readFile(path.join(__dirname, 'booksdb.js'), 'utf-8');

    // Parse the file data to JSON
    const books = JSON.parse(data);

    // Check if the book with the given ISBN exists
    if (books[isbn]) {
      // Send the book details as a response
      res.status(200).json({ message: books[isbn] });
    } else {
      // If the book is not found, return a 404
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (err) {
    // Handle any file reading errors
    console.error("Error reading books file:", err);
    res.status(500).json({ message: 'Error reading books file' });
  }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const titleName = req.params.title.toLocaleLowerCase();
  const booksBytitle = Object.values(books).filter(book =>
    book.title.toLowerCase() === titleName
  );

  return res.status(300).json({ message: booksBytitle });
});

// Define the route to get books based on title using async/await
public_users.get('/title/:title', async function (req, res) {
  const titleName = req.params.title.toLowerCase();

  try {
    // Read the local books.json file asynchronously
    const data = await fs.readFile(path.join(__dirname, 'books.json'), 'utf-8');

    // Parse the JSON data
    const books = JSON.parse(data);

    // Filter books based on the title
    const booksByTitle = Object.values(books).filter(book =>
      book.title.toLowerCase() === titleName
    );

    // Return the filtered books
    res.status(200).json({ message: booksByTitle });
  } catch (err) {
    // Handle any errors (e.g., file reading issues)
    console.error("Error reading books file:", err);
    res.status(500).json({ message: 'Error fetching books by title' });
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = Number(req.params.isbn);
  return res.status(200).json({ reviews: books[isbn].reviews });
});


module.exports.general = public_users;
