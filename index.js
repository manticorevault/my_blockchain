// Add the express server
const express = require("express");

const request = require("request");
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const PubSub = require('./application/pubsub');
const TransactionPool = require("./wallet/transaction-pool");
const Wallet = require("./wallet/index");
const TransactionMiner = require("./application/transaction-miner");

// Start the app
const app = express();
const blockchain = new Blockchain();

// Bring in the Wallet method
const wallet = new Wallet();

// Bring in the Transaction Pool
const transactionPool = new TransactionPool();

// Bring in the PubSub instance and attach the blockchain and transactionPool
const pubsub = new PubSub({ blockchain, transactionPool });

// Bring in and instantiate the TransactionMiner
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

// Define the DEFAULT_PORT to 3000 
const DEFAULT_PORT = 3000;

// Call the root node address
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

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

// Create an API call to conduct new transactions with an amount and a recipient

app.post("/api/transact", (req, res) => {
    const { amount, recipient } = req.body;

    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });

    // Handle invalid transactions
    try {
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount });
        } else {
            // Create a transaction
            transaction = wallet.createTransaction({ 
                recipient, 
                amount, 
                chain: blockchain.chain 
            });
        }

    } catch (error) {
        return res.status(400).json({ type: "error", message: error.message });
    }

    // Once the transaction has been created, set it into the app's transactionPool
    transactionPool.setTransaction(transaction);

    // Notify when a new transaction occurs and joins the pool
    pubsub.broadcastTransaction(transaction);

    // The response as a JSON object including the transaction
    res.json({ type: "success", transaction });
});

// Add an endpoint for the transaction pool map, with a get request
app.get("/api/transaction-pool-map", (req, res) => {
    res.json(transactionPool.transactionMap);
});

// Get request to mine transactions
app.get("/api/mine-transactions", (req, res) => {
    transactionMiner.mineTransactions();

    // Redirect the request to the blocks page in the API
    res.redirect("/api/blocks");
});

// Get request to retrieve the wallet's info
app.get("/api/wallet-info", (req, res) => {
    // Define the address as wallet.publicKey for DRY principles.
    const address = wallet.publicKey;

    res.json({ 
        address,
        balance: Wallet.calculateBalance({ 
            chain: blockchain.chain, 
            address
        })
     })
});


// Creates the syncWithRoot method to request the ROOT_NODE API endpoint
const syncWithRoot = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log("Replace the blockchain on a sync with", rootChain);
            blockchain.replaceChain(rootChain);
        }
    });

    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
        if (!error && response.statusCode === 200 ) {
            const rootTransactionPoolMap = JSON.parse(body)

            console.log("Replace the Transaction Pool Map when synchronizing with", rootTransactionPoolMap)
            
            transactionPool.setMap(rootTransactionPoolMap);
        };
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

    if (PORT !== DEFAULT_PORT) {
        syncWithRoot();
    }
});