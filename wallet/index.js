const Transaction = require("./transaction");
const { STARTING_BALANCE } = require("../blockchain/config");
const { ec, hashing } = require("../utils");

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode("hex");
    }

    sign(data) {
        return this.keyPair.sign(hashing(data))
    }

    createTransaction({ amount, recipient }) {
        if (amount > this.balance) {
            throw new Error("Amount exceeds balance!");
        }

        return new Transaction({ senderWallet: this, recipient, amount });
    }

    static calculateBalance({ chain, address }) {
        let outputsTotal = 0;

        for (let counter = 1; counter < chain.length; counter++) {
            const block = chain[counter];

            for (let transaction of block.data) {
                const addressOutput = transaction.outputMap[address];

                if (addressOutput) {
                    outputsTotal = outputsTotal + addressOutput;
                }
            }
        }

        return STARTING_BALANCE + outputsTotal;
    }
};

module.exports = Wallet;