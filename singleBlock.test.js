const { GENESIS_DATA } = require("./config");
const singleBlock = require("./singleBlock");
const hashing = require("./hashing");

describe("singleBlock", () => {
    const timestamp = "date";
    const lastHash = "last-block-hash";
    const individualHash = "personal-hash";
    const data = ["blockchain", "data"];
    const block = new singleBlock({
        timestamp,
        lastHash,
        individualHash,
        data
    });

    it("the block has a timestamp, lastHash, individualHash and data properties", () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
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

    describe("mineNewBlock()", () => {
        const lastBlock = singleBlock.genesis();
        const data = "mined data";
        const minedNewBlock = singleBlock.mineNewBlock({ lastBlock, data });

        it("returns a new singleBlock instance", () => {
            expect(minedNewBlock instanceof singleBlock).toBe(true);
        });

        it("sets the `lastHash` to be the `individualHash` of the lastBlock", () => {
            expect(minedNewBlock.lastHash).toEqual(lastBlock.individualHash);
        });

        it('sets the `data`', () => {
            expect(minedNewBlock.data).toEqual(data);
        });

        it('sets a `timepstamp`', () => {
            expect(minedNewBlock.timestamp).not.toEqual(undefined);
        });

        it("creates a SHA-256 `individual hash` based on the function's inputs", () => {
            expect(minedNewBlock.individualHash)
                .toEqual(hashing(minedNewBlock.timestamp, lastBlock.individualHash, data));
        });
    });
});