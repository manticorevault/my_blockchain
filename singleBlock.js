const { GENESIS_DATA } = require("./config");

class singleBlock {
    // Receives the block object as an argument
    constructor({ timestamp, lastBlockHash, individualHash, data }) {
        // Create the block's information based on this block's arguments.

        this.timestamp = timestamp;
        this.lastBlockHash = lastBlockHash;
        this.individualHash = individualHash;
        this.data = data;
    }

    // Create the genesis block as a new instance of singleBlock, but using genesis data
    static genesis() {
        return new singleBlock(GENESIS_DATA);
    }

    static mineNewBlock({ lastBlock, data }) {
        return new this({
            timestamp: Date.now(),
            lastBlockHash: lastBlock.individualHash,
            data
        });
    }
}

module.exports = singleBlock;
