const fs = require("fs");
const path = require("path");

const booksDbPath = path.join(__dirname, 'db', 'books.json');

function getAllBooks(req, res) {
    fs.readFile(booksDbPath, 'utf-8', (err, books) => {
        if (err) {
            res.writeHead(400)
            res.end("An error occured")
        };
        res.end(books);
    });
};

module.exports = {
    getAllBooks
}