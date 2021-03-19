class singleBlock {
    // Receives the block object as an argument
    constructor({ timestamp, lastBlockHash, individualHash, data }) {
        // Create the block's information based on this block's arguments.

        this.timestamp = timestamp;
        this.lastBlockHash = lastBlockHash;
        this.individualHash = individualHash;
        this.data = data;
    }
}

module.exports = singleBlock;
