const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here

    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "Unable to register user." });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });

});

public_users.get('/', async function (req, res) {
    try {
        const getBooks = () => new Promise((resolve) =>{
            setTimeout(() => resolve(books), 100);
        });

        const bookList = await getBooks();
        res.status(200).json(bookList);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch books", error: error.message});
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    
    try {
        const getBookByISBN = () => new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject(new Error("Book not found"));
            }
        });

        const bookDetails = await getBookByISBN();
        res.status(200).json(bookDetails);
    } catch (error) {
        res.status(404).json({ message: error.message});
    }
    
    // const book = books[parseInt(isbn)];

    // if (book) {
    //     res.status(200).json(book);
    // } else {
    //     res.status(404).json({ message: "Book not found" });
    // }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here

    const author = req.params.author;

    try {
        const getBooksByAuthor = () => new Promise((resolve, reject) => {
            const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error("No books found for this author"));
            }
        });

        const results = await getBooksByAuthor();
        res.status(200).json(results);
    } catch (error) {
        res.status(404).json({ message: error.message});
    }

    // const requestedAuthor = req.params.author.toLowerCase();
    // const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === requestedAuthor);

    // if (matchingBooks.length > 0) {
    //     res.status(200).json(matchingBooks);
    // } else {
    //     res.status(404).json({ message: "No books found by that author" });
    // }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here

    const requestedTitle = req.params.title.toLowerCase();
    const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === requestedTitle);

    if (matchingBooks.length > 0) {
        res.status(200).json(matchingBooks);
    } else {
        res.status(404).json({ message: "No books found with that title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here

    const isbn = req.params.isbn;
    const book = books[parseInt(isbn)];

    if (book) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
