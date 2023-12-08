const fs = require("fs");
const path = require("path");

// Path to db
const usersDbPath = path.join(__dirname, "db", "users.json");

// CREATE
function createUser(req, res) {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedBody = Buffer.concat(body).toString();
    const newUser = JSON.parse(parsedBody);
  
    fs.readFile(usersDbPath, "utf-8", (err, data) => {
      const existingUsers = JSON.parse(data);
      const lastUser = existingUsers[existingUsers.length - 1];
      const newUserId = Number(lastUser.id) + 1;
  
      existingUsers.push({ ...newUser, id: newUserId });
      fs.writeFile(usersDbPath, JSON.stringify(existingUsers), (err) => {
        if (err) {
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message: "Internal Server Error. Could not save book to database.",
            })
          );
        }
  
        res.writeHead(201);
        // res.end(JSON.stringify(newBook)); //For the tests
        res.end(
          JSON.stringify({
            message: "User created successfully.",
          })
        );
      });
    });
  });
}

// READ
function getAllUsers() {
  return new Promise((resolve, reject) => {
    fs.readFile(usersDbPath, "utf8", (err, users) => {
      if (err) {
        reject("An error occured!");
      }

      resolve(JSON.parse(users));
    });
  });
}

function authenticateUser(req, res) {
  return new Promise((resolve, reject) => {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", async () => {
      const parsedBody = Buffer.concat(body).toString();
      if (!parsedBody) {
        reject("Please enter your username and password");
      }

      const loginDetails = JSON.parse(parsedBody);
      const users = await getAllUsers();
      const userFound = users.find(
        (user) =>
          user.username === loginDetails.username &&
          user.password === loginDetails.password
      );

      if (!userFound) {
        reject("User not found! Please sign up!");
      }

      resolve();
    });
  });
}

module.exports = {
  getAllUsers,
  authenticateUser,
  createUser,
};
