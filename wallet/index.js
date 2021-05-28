const { STARTING_BALANCE } = require("../blockchain/config");
const { ec } = require("../utils");

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        const keyPair = ec.genKeyPair();
    }
}

module.exports = Wallet;