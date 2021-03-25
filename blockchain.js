const singleBlock = require("./singleBlock");

class Blockchain {
    constructor() {
        this.chain = [singleBlock.genesis()];
    }

    addBlock({ data }) {
        const newBlock = singleBlock.mineNewBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });

        this.chain.push(newBlock);
    }
}

module.exports = Blockchain;