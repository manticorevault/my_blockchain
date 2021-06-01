const { hashing } = require("../utils");

describe("hashing()", () => {
    

    it("generates a SHA-256 output", () => {
        expect(hashing("test"))
            .toEqual("4d967a30111bf29f0eba01c448b375c1629b2fed01cdfcc3aed91f1b57d5dd5e");
    });

    it("produces the same hash with the same input arguments being input in any order", () => {
        expect(hashing("one", "two", "three"))
        .toEqual(hashing("three", "one", "two"));
    });

    it("produces an unique hash when the properties have changed on an input", () => {
        const test = {};
        const originalHash = hashing(test);
        test["a"] = "a";

        expect(hashing(test)).not.toEqual(originalHash);
    });
});