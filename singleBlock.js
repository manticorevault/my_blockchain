const { GENESIS_DATA } = require("./config");
const hashing = require("./hashing");

class singleBlock {
    // Receives the block object as an argument
    constructor({ timestamp, lastHash, individualHash, data }) {
        // Create the block's information based on this block's arguments.

        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.individualHash = individualHash;
        this.data = data;
    }

    // Create the genesis block as a new instance of singleBlock, but using genesis data
    static genesis() {
        return new this(GENESIS_DATA);
    }

    static mineNewBlock({ lastBlock, data }) {

        // Import timestamp and hash as individual variables
        const timestamp = Date.now();
        const lastHash = lastBlock.individualHash;

        return new this({
            timestamp,
            lastHash,
            data,
            individualHash: hashing(timestamp, lastHash, data)
        });
    }
}

module.exports = singleBlock;
