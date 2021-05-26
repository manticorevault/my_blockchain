// Add the express server
const express = require("express");

const request = require("request");
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain/blockchain");
const PubSub = require('./pubsub');

// Start the app
const app = express();
const blockchain = new Blockchain();

// Bring in the PubSub instance
const pubsub = new PubSub({ blockchain });

// Define the DEFAULT_PORT to 3000 
const DEFAULT_PORT = 3000;

// Call the root node address
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

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

// Creates the syncChains method to request the ROOT_NODE API endpoint
const syncChains = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log("Replace the blockchain on a sync with", rootChain);
            blockchain.replaceChain(rootChain);
        }
    });
};

// Creates the variable PEER_PORT
let PEER_PORT;

// Define a random PEER_PORT if the DEFAULT_PORT is taken
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

// Defines the PORT as the PEER_PORT or the DEFAULT_PORT, whichever is available
const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`It's connected and running on port ${PORT}`);

    syncChains();
});