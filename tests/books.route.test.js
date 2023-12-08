const supertest = require("supertest");
const booksRoute = require("../books");
const server = require("../index");

describe('Book functions', () => {
    it("GET /books works", async () => {
        const response = await supertest(server).get("/books")
        expect(response.headers["content-type"]).toBe("application/json")
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(4)

    });

    it("POST /newbook works", async () => {
        const bookToAdd = {
            "title": "New test book",
            "author": "Rising Odegua",
            "year": 2022,
        };
        const response = await supertest(server).post("/newbook").send(bookToAdd)
        expect(response.headers["content-type"]).toBe("application/json")
        expect(response.status).toBe(201)
        expect(response.body.title).toBe("New test book")
        expect(response.body.author).toBe("Rising Odegua")
        expect(response.body.year).toBe(2022)
    });
});