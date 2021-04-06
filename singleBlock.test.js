const { GENESIS_DATA, MINE_RATE } = require("./config");
const singleBlock = require("./singleBlock");
const hashing = require("./hashing");
const hexToBinary = require("hex-to-binary");

describe("singleBlock", () => {
    const timestamp = 2000;
    const lastHash = "last-block-hash";
    const individualHash = "personal-hash";
    const data = ["blockchain", "data"];
    const nonce = 1;
    const difficulty = 1;
    const block = new singleBlock({
        timestamp,
        lastHash,
        individualHash,
        data,
        nonce,
        difficulty
    });

    it("the block has a timestamp, lastHash, individualHash and data properties", () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.individualHash).toEqual(individualHash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
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
                .toEqual(hashing(
                    minedNewBlock.timestamp, 
                    minedNewBlock.nonce, 
                    minedNewBlock.difficulty, 
                    lastBlock.individualHash, 
                    data
                )
            );
        });

        it("sets a `hash` that matches the difficulty criteria", () => {
            expect(hexToBinary(minedNewBlock.individualHash).substring(0, minedNewBlock.difficulty))
                .toEqual("0".repeat(minedNewBlock.difficulty))
        });

        it("adjusts the block difficulty", () => {
            const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1];

            expect(possibleResults.includes(minedNewBlock.difficulty)).toBe(true);
        });
    });

    describe("adjustDifficulty()", () => {
        it("raises the difficulty for a quickly mined block", () => {
            expect(singleBlock.adjustDifficulty({ 
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty + 1);
        });

        it("lowers the difficulty for a slowly mined block", () => {
            expect(singleBlock.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty - 1);
        });

        it("has a lower limit of one", () => {
            block.difficulty = -1

            expect(singleBlock.adjustDifficulty({ originalBlock: block})).toEqual(1);
        });
    });
});