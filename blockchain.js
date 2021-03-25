const singleBlock = require("./singleBlock");

// Create the blockchain class to add the first block as genesis
class Blockchain {
    constructor() {
        this.chain = [singleBlock.genesis()];
    }

    // Create the addBlock function to get data as props and add to the blockchain array
    addBlock({ data }) {
        const newBlock = singleBlock.mineNewBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });

        this.chain.push(newBlock);
    }
}

module.exports = Blockchain;