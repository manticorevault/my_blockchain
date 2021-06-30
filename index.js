// Add the express server
const express = require("express");

const request = require("request");
const path = require("path");
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const PubSub = require('./application/pubsub');
const TransactionPool = require("./wallet/transaction-pool");
const Wallet = require("./wallet/index");
const TransactionMiner = require("./application/transaction-miner");

// Fetch the ENV configurations to check if it's DEV or PROD
const isDev = process.env.ENV = "development";

// Call the REDIS server URL
const REDIS_URL = isDev ? 
    "redis://127.0.0.1:6379" :
    "redis://:pdf5a0ef3ec7363609aa34bbfb1037d653a212f6192da994eed4a9b4b97b61a65@ec2-3-227-65-108.compute-1.amazonaws.com:27979"

// Define the DEFAULT_PORT to 3000 
const DEFAULT_PORT = 3000;

// Call the root node address
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

// Start the app
const app = express();
const blockchain = new Blockchain();

// Bring in the Wallet method
const wallet = new Wallet();

// Bring in the Transaction Pool
const transactionPool = new TransactionPool();

// Bring in the PubSub instance and attach the blockchain, transactionPool and REDIS_URL
const pubsub = new PubSub({ blockchain, transactionPool, redisUrl: REDIS_URL });

// Bring in and instantiate the TransactionMiner
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

// Call the bodyParser middleware
app.use(bodyParser.json());

// Call up the express middleware to server static files
app.use(express.static(path.join(__dirname, "client/dist")));

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
    res.json({ type: "Success", transaction });
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

// Accepts HTTP requests from the index.html
app.get("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "client/dist/index.html")   
    );
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

// A simple check to define which environment it's running on
if (isDev) {
        // Add two test wallets for development purpose, to create transactional data visualized in the front end
    const walletTest = new Wallet();
    const walletDev = new Wallet();

    // Create a helper method to help conduct transactions between wallets
    const generateWalletTransaction = ({ wallet, recipient, amount }) => {
        const transaction = wallet.createTransaction({
            recipient,
            amount,
            chain: blockchain.chain
        });

        transactionPool.setTransaction(transaction);
    };

    // Create helper methods to deal with walletActions
    const walletAction = () => generateWalletTransaction({
        wallet, 
        recipient: walletTest.publicKey, 
        amount: 10
    });

        
    const walletTestAction = () => generateWalletTransaction({
        wallet: walletTest,
        recipient: walletDev.publicKey,
        amount: 15
    });

    const walletDevAction = () => generateWalletTransaction({
        wallet: walletDev,
        recipient: wallet.publicKey,
        amount: 25
    });

    // Create a loop to conduct a combination of these helper method transactions
    for (let counter = 0; counter < 10; counter++) {
        if (counter%3 === 0) {
            walletAction();
            walletTestAction();
        } else if (counter%3 === 1) {
            walletAction();
            walletDevAction();
        } else {
            walletTestAction();
            walletDevAction();
        }

        // Call the transactionMiner to mineTransactions() and add them to the blockchain
        transactionMiner.mineTransactions();
    }

}


// Creates the variable PEER_PORT
let PEER_PORT;

// Define a random PEER_PORT if the DEFAULT_PORT is taken
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

// Defines the PORT as the ENV PORT, the PEER_PORT or the DEFAULT_PORT, whichever is available
const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`It's connected and running on port ${PORT}`);

    if (PORT !== DEFAULT_PORT) {
        syncWithRoot();
    }
});