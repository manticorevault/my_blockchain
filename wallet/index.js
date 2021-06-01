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
};

module.exports = Wallet;