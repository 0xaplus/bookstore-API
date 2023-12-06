const fs = require("fs");
const path = require("path");

// Books Database
const booksDbPath = path.join(__dirname, "db", "books.json");
const booksDB = JSON.parse(fs.readFileSync(booksDbPath, "utf8"));

// CREATE
function addNewBook(req, res) {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedBody = Buffer.concat(body).toString();
    const newBook = JSON.parse(parsedBody);
    const lastBook = booksDB[booksDB.length - 1];
    const newBookId = Number(lastBook.id) + 1;

    booksDB.push({ ...newBook, id: newBookId });
    fs.writeFile(booksDbPath, JSON.stringify(booksDB), (err) => {
      if (err) {
        res.writeHead(500);
        res.end(
          JSON.stringify({
            message: "Internal Server Error. Could not save book to database.",
          })
        );
      }

      res.end(
        JSON.stringify({
          message: "Book added successfully.",
        })
      );
    });
  });
}

// READ
function getAllBooks(req, res) {
  fs.readFile(booksDbPath, "utf-8", (err, books) => {
    if (err) {
      res.writeHead(400);
      res.end("An error occured");
    }
    res.end(books);
  });
}

// UPDATE

function updateBook(req, res) {
  const body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedBody = Buffer.concat(body).toString();
    const bookToUpdate = JSON.parse(parsedBody);

    // find book in the database
    const bookIndex = booksDB.findIndex((book) => book.id === bookToUpdate.id);

    // Return 404 if book not found
    if (bookIndex === -1) {
      res.writeHead(404);
      res.end(
        JSON.stringify({
          message: "Book not found",
        })
      );
      return;
    }
    // update the existing book
    booksDB[bookIndex] = { ...booksDB[bookIndex], ...bookToUpdate };

    //save to db
    fs.writeFile(booksDbPath, JSON.stringify(booksDB), (err) => {
      if (err) {
        res.writeHead(500);
        res.end(
          JSON.stringify({
            message:
              "Internal Server Error. COuld not update book in the database",
          })
        );
      }

      res.writeHead(200);
      res.end(JSON.stringify(booksDB[bookIndex]));
    });
  });
}

// DELETE
function deleteBook(req, res) {
  const bookId = req.url.split("/")[2];

  const bookIndex = booksDB.findIndex((book) => book.id === parseInt(bookId));
  if (bookIndex === -1) {
    res.writeHead(404);
    res.end(
      JSON.stringify({
        message: "Book not found!",
      })
    );

    return;
  }

  // booksDB.splice(bookIndex, 1);
  booksDB.pop(bookIndex);

  // update the db
  fs.writeFile(booksDbPath, JSON.stringify(booksDB), (err) => {
    if (err) {
      console.log(err);
      res.writeHead(500);
      res.end(
        JSON.stringify({
          message:
            "Internal Server Error. Could not delete book from database.",
        })
      );
    }

    res.end(
      JSON.stringify({
        message: "Book deleted",
      })
    );
  });
}

function loanOrReturn(req, res, state) {
  let message, status, errorMessage;

  if (state === "loan") {
    message = "Book loaned out successfully.";
    status = true;
    errorMessage = "Internal Server Error. Could not loan out book";
  } else {
    message = "Book returned successfully.";
    status = false;
    errorMessage = "An error occurred. Could not return book";
  }

  const body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedBody = Buffer.concat(body).toString();
    const bookReq = JSON.parse(parsedBody);

    const bookToLoan = booksDB.find((book) => {
      return book.title === bookReq.title && book.author === bookReq.author;
    });

    // update the existing book
    const bookIndex = parseInt(bookToLoan.id) - 1;
    booksDB[bookIndex] = { ...booksDB[bookIndex], loaned: status };

    //save to db
    fs.writeFile(booksDbPath, JSON.stringify(booksDB), (err) => {
      if (err) {
        res.writeHead(500);
        res.end(
          JSON.stringify({
            message: errorMessage,
          })
        );
      }

      res.writeHead(200);
      res.end(
        JSON.stringify({
          message,
        })
      );
    });
  });
}

// lOANOUT
function loanOut(req, res) {
  loanOrReturn(req, res, "loan");
}

// RETURN
function returnBook(req, res) {
  loanOrReturn(req, res, "return");
}

module.exports = {
  getAllBooks,
  addNewBook,
  deleteBook,
  updateBook,
  loanOut,
  returnBook,
};