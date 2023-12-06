const supertest = require("supertest");
const booksRoute = require("../books");

describe('Book Route', () => {

    it("GET /books works", async () => {
        const response = await supertest(booksRoute).get("/books");
        expect(response.headers["content-type"]).toBe("application/json");
        expect(response.status).toBe(200);
    });
});