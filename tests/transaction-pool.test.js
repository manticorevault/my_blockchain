const TransactionPool = require("../wallet/transaction-pool");
const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet/index");
const Blockchain = require("../blockchain");

describe("TransactionPool", () => {
    let transactionPool, transaction, senderWallet;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet()
        transaction = new Transaction({
            senderWallet,
            recipient: "test-recipient",
            amount: 50
        });
    });

    describe("setTransaction()", () => {
        it("adds a transaction", () => {
            transactionPool.setTransaction(transaction);

            expect(transactionPool.transactionMap[transaction.id])
                .toBe(transaction);
        });
    });

    describe("existingTransaction()", () => {
        it("returns an existing transaction after an input address", () => {
            transactionPool.setTransaction(transaction);

            expect(
                transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })
            ).toBe(transaction);
        });
    });

    describe("validTransactions()", () => {
        let validTransactions, errorMock;

        beforeEach(() => {
            validTransactions = [];
            errorMock = jest.fn();
            global.console.error = errorMock;

            for (let counter = 0; counter < 10; counter++) {
                transaction = new Transaction({
                    senderWallet,
                    recipient: "anyone",
                    amount: 30
                });

                if(counter%3 === 0) {
                    transaction.input.amount = 999999;
                } else if (counter%3 === 1){
                    transaction.input.signature = new Wallet().sign("test");
                } else {
                    validTransactions.push(transaction);
                }

                transactionPool.setTransaction(transaction) 
            }
        });

        it("returns all the valid transactions", () => {
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });

        it("logs errors anytime an invalid transaction occurs", () => {
            transactionPool.validTransactions();

            expect(errorMock).toHaveBeenCalled();
        });
    });

    describe("clear()", () => {
        it("clears the transactions", () => {
            transactionPool.clear();

            expect(transactionPool.transactionMap).toEqual({});
        });
    });

    describe("clearBlockchainTransactions", () => {
        it("clears the pool of any exisiting blockchain transactions", () => {
            const blockchain = new Blockchain();
            const expectedTransactionMap = {};

            for (let counter = 0; counter < 6; counter++) {
                const transaction = new Wallet().createTransaction({
                    recipient: "test-recipient", 
                    amount: 30
                });

                transactionPool.setTransaction(transaction);

                if (counter%2 === 0) {
                    blockchain.addBlock({ data: [transaction]})
                } else {
                    expectedTransactionMap[transaction.id] = transaction;
                }
            }

            transactionPool.clearBlockchainTransactions({ chain: blockchain.chain });

            expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
        });
    });
});
