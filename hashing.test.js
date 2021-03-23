const hashing = require("./hashing");

describe("hashing()", () => {
    

    it("generates a SHA-256 output", () => {
        expect(hashing("test")).
        toEqual("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08");
    });

    it("produces the same hash with the same input arguments being input in any order", () => {
        expect(hashing("one", "two", "three"))
        .toEqual(hashing("three", "one", "two"));
    })
});