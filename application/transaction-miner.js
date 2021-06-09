class TransactionMiner {
    constructor(blockchain, transactionPool, wallet, pubsub) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;

    }

    mineTransaction() {
        //TODO: Get all the valid transactions from the transaction pool

        //TODO: Reward the miners

        //TODO: Attach a block to the blockchain, containing all the transactions

        //TODO: Broadcast the information and update the blockchain

        //TODO: Clear the pool
    }
}

module.exports = TransactionMiner;