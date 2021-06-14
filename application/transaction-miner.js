const Transaction = require("../wallet/transaction");

class TransactionMiner {
    constructor(blockchain, transactionPool, wallet, pubsub) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;

    }

    mineTransaction() {
        //Get all the valid transactions from the transaction pool
        const validTransactions = this.transactionPool.validTransactions();

        //Reward the miners
        validTransactions.push(
            Transaction.rewardTransaction({ minerWallet: this.wallet })
        );
    
        //Attach a block to the blockchain, containing all the transactions
        this.blockchain.addBlock({ data: validTransactions });

        //Broadcast the information and update the blockchain
        this.pubsub.broadcastChain();

        //Clear the pool
        this.transactionPool.clear();
    }
}

module.exports = TransactionMiner;