const http = require("http");
const usersMethods = require("./users");
const booksMethods = require("./books");

const port = 3000;
const hostname = "localhost";

function requestHandler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/books" && req.method === "GET") {
    // You can only view all the books when you're authorized
    usersMethods
      .authenticateUser(req, res)
      .then(() => {
        booksMethods.getAllBooks(req, res);
      })
      .catch((err) => {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            message: err,
          })
        );
      });
  } else if (req.url === "/createuser" && req.method === "POST") {
    usersMethods.createUser(req, res);
  } else if (req.url === "/newbook" && req.method === "POST") {
    booksMethods.addNewBook(req, res);
  } else if (req.url === "/books/loan" && req.method === "POST") {
    booksMethods.loanOut(req, res);
  } else if (req.url === "/books/return" && req.method === "POST") {
    booksMethods.returnBook(req, res);
  } else if (req.url === "/books" && req.method === "PUT") {
    booksMethods.updateBook(req, res);
  } else if (req.url.startsWith("/books") && req.method === "DELETE") {
    booksMethods.deleteBook(req, res);
  } else {
    res.writeHead(404);
    res.end(
      JSON.stringify({
        message: "Method Not Supported",
      })
    );
  }
}

// Server
const server = http.createServer(requestHandler);
server.listen(port, hostname, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = server;