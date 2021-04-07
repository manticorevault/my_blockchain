// Global mining variables
const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000;

// Create the Genesis Block's information.

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: "-",
    individualHash: "genesis-hash",
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
};

module.exports = { GENESIS_DATA, MINE_RATE };