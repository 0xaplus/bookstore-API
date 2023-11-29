const fs = require("fs");
const path = require("path");

const booksDbPath = path.join(__dirname, 'db', 'books.json');
const booksDB = JSON.parse(fs.readFileSync(booksDbPath, 'utf8'));

function getAllBooks(req, res) {
    fs.readFile(booksDbPath, 'utf-8', (err, books) => {
        if (err) {
            res.writeHead(400)
            res.end("An error occured")
        };
        res.end(books);
    });
};

// CREATE
function addNewBook(req, res) {
    const body = [];
    
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const newBook = JSON.parse(parsedBody);

        const lastBook = booksDB[booksDB.length - 1];
        const newBookId = Number(lastBook.id) + 1;

        booksDB.push({...newBook, "id": newBookId});
        fs.writeFile(booksDbPath, JSON.stringify(booksDB), err => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({
                    message: 'Internal Server Error. Could not save book to database.'
                }));
            }

            res.end(JSON.stringify({
                message: "Book added successfully."
            }));
        });
    });
};

// UPDATE
function updateBook(req, res) {

}

// DELETE
function deleteBook(req, res) {
    const bookId = req.url.split('/')[2]

    const bookIndex = booksDB.findIndex(book => book.id === parseInt(bookId))
    if (bookIndex === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({
            message: 'Book not found'
        }));

        return;
    }

    booksDB.slice(bookIndex, 1);

    // update the db
    fs.writeFile(booksDbPath, JSON.stringify(booksDB), err => {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end(JSON.stringify({
                message: 'Internal Server Error. Could not delete book from database.'
            }));
        }

        res.end(JSON.stringify({
            message: 'Book deleted'
        }));
    })
}

module.exports = {
    getAllBooks,
    addNewBook,
    deleteBook,
    updateBook
}