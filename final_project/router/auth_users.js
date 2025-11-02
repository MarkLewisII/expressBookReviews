const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error loggin in"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60});
    
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User succefully logged in");
    } else {
        return res.status(200).json({ message: "Invalid Login. Check username and password"});
    }

//   return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session?.authorization?.username;

    if (!username) {
        return res.status(403).json({ message: "User not authenticated"});
    }

    if (!review) {
        return res.status(400).json({ message: "Review query missing"});
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found"});
    }

    book.reviews[username] = review;

    return res.status(200).json({
        message: "Review successfully added or updated",
        reviews: book.reviews
    });

//   return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session?.authorization?.username;

    if (!username) {
        return res.status(403).json({ message: "User not authenticated"});
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found"});
    }

    if (!book.reviews[username]) {
        return res.status(404).json({ message: "No review found for this user on this book"});
    }

    delete book.reviews[username];

    return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
