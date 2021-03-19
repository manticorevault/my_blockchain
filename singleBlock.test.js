const { GENESIS_DATA } = require("./config");
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

    describe("test for a genesis function", () => {
        const genesisBlock = singleBlock.genesis();

        console.log("genesisBlock", genesisBlock);

        it("returns a block instance", () => {
            expect(genesisBlock instanceof singleBlock).toEqual(true);
        });

        it("returns the data from the genesis block", () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });
});