const fs = require("fs");
const path = require("path");

// Path to db
const usersDbPath = path.join(__dirname, 'db', 'users.json');

// CREATE
function createUser(req, res) {
    const body = [];
    
    req.on('data', chunk => {
        body.push(chunk);
    });

    const parsedBody = Buffer.concat(body).toString();
    res.on('end', () => {
        const newUser = JSON.parse(parsedBody);

        fs.readFile(usersDbPath, "utf-8", (err, data) => {
            const existingUsers = JSON.parse(data);
            console.log(existingUsers);
        })
    })
}

// READ
function getAllUsers(req, res) {
    return new Promise((resolve, reject) => {
        fs.readFile(usersDbPath, 'utf8', (err, users) => {
            if (err) {
                reject('An error occured!');
            };
    
            resolve(JSON.parse(users));
        });
    });
};

function authenticateUser(req, res) {
    return new Promise((resolve, reject) => {
        if (err) {
            reject(err)
        };

        const body = [];
    
        req.on('data', chunk => {
            body.push(chunk);
        });

        req.on('end', async () => {
            const parsedBody = Buffer.concat(body).toString();
            if (!parsedBody) {
                reject("Please enter your username and password");
            };

            const loginDetails = JSON.parse(parsedBody);

            const users = await getAllUsers();
            const userFound = users.find(user => user.username === loginDetails.username && user.password === loginDetails.password);

            if (!userFound) {
                reject('User not found! Please sign up!');
            };

            if (userFound.password !== loginDetails.password) {
                reject('Invalid username or password!');
            }
            resolve();
        });
    });
};

// CREATE


module.exports = {
    getAllUsers,
    authenticateUser
}