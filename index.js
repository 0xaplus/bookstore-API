const http = require("http");
const usersMethods = require("./users");
const booksMethods = require("./books");

const port = 3000;
const hostname = "localhost";

function requestHandler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/books" && req.method === "GET") {
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
  }
  else {
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
  console.log(`Server is listening https://${hostname}:${port}/`);
});
