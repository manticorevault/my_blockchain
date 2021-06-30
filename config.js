// Global mining variables
const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000;

// Create the Genesis Block's information.
const GENESIS_DATA = {
    timestamp: 1,
    lastHash: "-",
    individualHash: "[Peter Gabriel, Tony Banks, Mike Rutherford, Phil Collins, Steve Hackett]",
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
};

const STARTING_BALANCE = 1000;

const REWARD_INPUT = {
    address: "Authorized Reward"
};

const MINING_REWARD = 50;

module.exports = {
    GENESIS_DATA, 
    MINE_RATE, 
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD
};