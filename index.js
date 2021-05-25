// Add the express server
const express = require("express");

const bodyParser = require("body-parser");
const Blockchain = require("./blockchain/blockchain");
const PubSub = require('./pubsub');

// Start the app
const app = express();
const blockchain = new Blockchain();

// Bring in the PubSub instance
const pubsub = new PubSub({ blockchain });

setTimeout(() => pubsub.broadcastChain(), 1000);

// Call the bodyParser middleware
app.use(bodyParser.json());

// Create a get request to get all the blocks on the blockchain
app.get("/api/blocks", (req, res) => {
    res.json(blockchain.chain);
});

// Add a method to mine a new block on the blockchain
app.post("/api/mine", (req, res) => {
    const { data } = req.body

    // Add the new block
    blockchain.addBlock({ data })

    // Call PubSub to broadcast the chain
    pubsub.broadcastChain();

    // Return a confirmation to the end user, by returning the user to the blockchain scan
    res.redirect("/api/blocks");
});

// Define the DEFAULT_PORT to 300 and creates the variable PEER_PORT
const DEFAULT_PORT = 3000;
let PEER_PORT;

// Define a random PEER_PORT if the DEFAULT_PORT is taken
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

// Defines the PORT as the PEER_PORT or the DEFAULT_PORT, whichever is available
const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`It's connected and running on port ${PORT}`)
});