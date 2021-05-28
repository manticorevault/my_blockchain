const { STARTING_BALANCE } = require("../blockchain/config");
const { ec } = require("../utils");
const hashing = require("../utils/hashing");

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