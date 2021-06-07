const TransactionPool = require("../wallet/transaction-pool");
const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet/index");
const { utils } = require("elliptic");

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
});
