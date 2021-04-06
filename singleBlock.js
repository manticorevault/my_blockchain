const { GENESIS_DATA, MINE_RATE } = require("./config");
const hashing = require("./hashing");

class singleBlock {
    // Receives the block object as an argument
    constructor({ timestamp, lastHash, individualHash, data, nonce, difficulty }) {
        // Create the block's information based on this block's arguments.

        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.individualHash = individualHash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    // Create the genesis block as a new instance of singleBlock, but using genesis data
    static genesis() {
        return new this(GENESIS_DATA);
    }

    static mineNewBlock({ lastBlock, data }) {

        let individualHash, timestamp;
        // Import timestamp and hash as individual variables

        // const timestamp = Date.now();
        const lastHash = lastBlock.individualHash;
        const { difficulty } = lastBlock;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            individualHash = hashing(timestamp, lastHash, data, nonce, difficulty);
        } while (individualHash.substring(0, difficulty) !== "0".repeat(difficulty));

        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            individualHash
        //    individualHash: hashing(timestamp, lastHash, data, nonce, difficulty)
        });
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;

        const diff = timestamp - originalBlock.timestamp;

        if(diff > MINE_RATE) return difficulty - 1;

        return difficulty + 1;
    }
}

module.exports = singleBlock;
