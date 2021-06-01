const { GENESIS_DATA, MINE_RATE } = require("./config");
const { hashing } = require("../utils");
const hexToBinary = require("hex-to-binary");

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

        // Import timestamp and hash as individual variables
        let individualHash, timestamp;

        // Dynamic variable for difficulty
        let { difficulty } = lastBlock;

        // const timestamp = Date.now();
        const lastHash = lastBlock.individualHash;
        
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = singleBlock.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            individualHash = hashing(timestamp, lastHash, data, nonce, difficulty);
        } while (hexToBinary(individualHash).substring(0, difficulty) !== "0".repeat(difficulty));

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

        // Consider the edge case in which the difficulty would be 0
        if(difficulty < 1) return 1;

        if(diff > MINE_RATE) return difficulty - 1;

        return difficulty + 1;
    }
}

module.exports = singleBlock;
