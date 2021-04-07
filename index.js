// Add the express server
const express = require("express");

const bodyParser = require("body-parser");
const Blockchain = require("./blockchain/blockchain");

// Start the app
const app = express();
const blockchain = new Blockchain();

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

    // Return a confirmation to the end user, by returning the user to the blockchain scan
    res.redirect("/api/blocks");
});

// Listen to the server on port 3000
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`It's connected and running on port ${PORT}`)
});