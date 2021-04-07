const singleBlock = require("./singleBlock");
const hashing = require("./hashing");

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

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.error("The new chain must be longer")
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error("The new chain must be valid")
            return;
        }

        console.log("Replacing the current chain with", chain);
        this.chain = chain;
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(singleBlock.genesis())) {
            return false;
        };

        // Validate the chain with a for loop skipping the genesis block (chain[0])
        for (let index = 1; index < chain.length; index++) {
            const { timestamp, lastHash, individualHash, nonce, difficulty, data } = chain[index];
            const currentLastHash = chain[index - 1].individualHash;
            const lastDifficulty = chain[index - 1].difficulty;

            if (lastHash !== currentLastHash) return false;

            const validatedHash = hashing(timestamp, lastHash, data, nonce, difficulty);

            if (individualHash !== validatedHash) return false;

            // A guard condition against jumped difficulties
            if (Math.abs(lastDifficulty - difficulty) > 1) return false; 
        }



        return true;
    }
}

module.exports = Blockchain;