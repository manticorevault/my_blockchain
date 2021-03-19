const singleBlock = require("./singleBlock");

describe("singleBlock", () => {
    const timestamp = "date";
    const lastBlockHash = "last-block-hash";
    const individualHash = "personal-hash";
    const data = ["blockchain", "data"];
    const block = new singleBlock({
        timestamp,
        lastBlockHash,
        individualHash,
        data
    });

    it("the block has a timestamp, lastBlockHash, individualHash and data properties", () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastBlockHash).toEqual(lastBlockHash);
        expect(block.individualHash).toEqual(individualHash);
        expect(block.data).toEqual(data);
    });
});