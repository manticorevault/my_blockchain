class singleBlock {
    // Receives the block object 
    constructor({ timestamp, lastBlockHash, individualHash, data }) {
        // Create the block's information based on this block's instance.

        this.timestamp = timestamp;
        this.lastBlockHash = lastBlockHash;
        this.individualHash = individualHash;
        this.data = data;
    }
}

const genesisBlock = new singleBlock({
    timestamp: "19/03/2021", 
    lastBlockHash: "lastHash", 
    individualHash: "hash", 
    data: "block's data"
});

console.log("firstBlock", genesisBlock);