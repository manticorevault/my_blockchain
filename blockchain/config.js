// Global mining variables
const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000;

// Create the Genesis Block's information.

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: "-",
    individualHash: "This is the [Peter Gabriel, Tony Banks, Mike Rutherford, Phil Collins, Steve Hackett] block",
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
};

const STARTING_BALANCE = 1000;

module.exports = { GENESIS_DATA, MINE_RATE, STARTING_BALANCE };