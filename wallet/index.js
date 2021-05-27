const { STARTING_BALANCE } = require("../blockchain/config");

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;
    }
}

module.exports = Wallet;