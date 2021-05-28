const EC = require("elliptic").ec;
const hashing = require("./hashing");

const ec = new EC("secp256k1");

const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, "hex");

    return keyFromPublic.verify(hashing(data), signature)
};

module.exports = { ec, verifySignature };