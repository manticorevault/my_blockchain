const singleBlock = require("./singleBlock");
const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");
const { hashing } = require("../utils");
const { REWARD_INPUT, MINING_REWARD } = require("../config");

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

    replaceChain(chain, validateTransactions, onSuccess) {
        if (chain.length <= this.chain.length) {
            console.error("The new chain must be longer")
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error("The new chain must be valid")
            return;
        }

        if (validateTransactions && !this.validTransactionData({ chain })) {
            console.error("The chain must be valid");
            return;
        }

        if (onSuccess) onSuccess();
        
        console.log("Replacing the current chain with", chain);
        this.chain = chain;
    }

    validTransactionData({ chain }) {
        for (let counter = 1; counter < chain.length; counter++) {
            const block = chain[counter];
            // Create a set of unique items, so the transactions are unique
            const transactionSet = new Set();
            let rewardCounter = 0;

            for (let transaction of block.data) {
                if (transaction.input.address === REWARD_INPUT.address) {
                    rewardCounter += 1;

                    if (rewardCounter > 1) {
                        console.error("Miner rewards exceed proposed limits");

                        return false
                    }

                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.error("Miner reward amount is invalid");

                        return false;
                    }
                } else {
                    if (!Transaction.validTransaction(transaction)) {
                        console.error("This is an invalid Transaction!");

                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address
                    });

                    if (transaction.input.amount !== trueBalance) {
                        console.error("Invalid input amount")

                        return false;
                    }

                    if (transactionSet.has(transaction)) {
                        console.error("There is a duplicated transaction in the block")
                        return false; 
                    } else {
                        transactionSet.add(transaction);
                    }
                }
            }
        }

        return true;
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