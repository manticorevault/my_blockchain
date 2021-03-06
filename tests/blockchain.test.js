const Blockchain = require("../blockchain/index");
const singleBlock = require("../blockchain/singleBlock");
const { hashing } = require("../utils");
const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");

describe("Blockchain", () => {
    let blockchain, newChain, originalChain, errorMock;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        errorMock = jest.fn();

        originalChain = blockchain.chain;
        global.console.error = errorMock;
    })

    it("contains a `chain` Array instance", () => {
        expect(blockchain.chain instanceof Array).toEqual(true);
    });

    it("starts with the genesis block", () => {
        expect(blockchain.chain[0]).toEqual(singleBlock.genesis());
    });

    it("adds a new block to the chain", () => {
        const newData = "test data";
        blockchain.addBlock({ data: newData });

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });

    describe("isValidChain()", () => {
        describe("for when the chain does not start with the genesis block", () => {
            it ("returns false", () => {
                blockchain.chain[0] = { data: "fake-genesis"};

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe("for when the chain starts with the genesis block and has multiple blocks", () => {
            
            beforeEach(() => {
                blockchain.addBlock({ data: "Servant" });
                blockchain.addBlock({ data: "Spiderman" });
                blockchain.addBlock({ data: "Dune" });
            })
            
            describe("the lastHash reference has changed", () => {
                it ("returns false", () => {

                    blockchain.chain[2].lastHash = "tampered-lastHash";

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe("and the chain contains a block with an invalid field", () => {
                it ("returns false", () => {

                    blockchain.chain[2].data = "hacked-data"

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe("the chain contains a block with a so-called jumped difficulty", () => {
                it("returns false", () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length - 1];

                    const lastHash = lastBlock.individualHash;

                    const timestamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;

                    // Now call a block with jumped difficulty
                    const individualHash = hashing(timestamp, lastHash, difficulty, nonce, data);

                    const jumpedBlock = new singleBlock ({ 
                        timestamp, 
                        lastHash,
                        individualHash,
                        difficulty, 
                        nonce, 
                        data 
                    })

                    blockchain.chain.push(jumpedBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe("the chain works correctly and has no invalid blocks", () => {
                it("returns true", () => {

                    console.log(blockchain.chain)
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

    describe("replaceChain()", () => {
        let logMock;

        beforeEach(() => {
            logMock = jest.fn();

            global.console.log = logMock;
        })

        describe("when the new chain is not longer", () => {

            beforeEach(() => {
                newChain.chain[0] = { new: "chain" };

                blockchain.replaceChain(newChain.chain);
            });

            it("does not replace the chain", () => {
                expect(blockchain.chain).toEqual(originalChain);
            });

            it("logs an error", () => {
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe("when the new chain is longer", () => {

            beforeEach(() => {
                newChain.addBlock({ data: "Servant" });
                newChain.addBlock({ data: "Spiderman" });
                newChain.addBlock({ data: "Dune" });
            })

            describe("and then chain is invalid", () => {
                beforeEach(() => {
                    newChain.chain[2].individualHash = "fake-hash";

                    blockchain.replaceChain(newChain.chain);
                });

                it("does not replace the chain", () => {
                    expect(blockchain.chain).toEqual(originalChain);
                });

                it("logs an error", () => {
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe("and the chain is valid", () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                })

                it("does replace the chain", () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it("logs the chain replacement", () => {
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });

        describe("and the `validateTransaction` is true", () => {
            it("calls the validTransactionData()", () => {
                const validTransactionDataTest = jest.fn();

                blockchain.validTransactionData = validTransactionDataTest;

                newChain.addBlock({ data: "test" });
                blockchain.replaceChain(
                    newChain.chain,
                    true
                );

                expect(validTransactionDataTest).toHaveBeenCalled();
            });
        });
    });

    describe("validTransactionData()", () => {
        let transaction, rewardTransaction, wallet;

        beforeEach(() => {
            wallet = new Wallet();
            transaction = wallet.createTransaction({ recipient: "test-address", amount: 100 });
            rewardTransaction = Transaction.rewardTransaction({ minerWallet: wallet });
        });

        describe("the transaction data is valid", () => {
            it("returns true", () => {
                newChain.addBlock({
                    data: [transaction, rewardTransaction]
                });

                expect(
                    blockchain.validTransactionData({
                        chain: newChain.chain
                    })
                ).toBe(true);
                expect(errorMock).not.toHaveBeenCalled();
            });
        });

        describe("and the transaction data has multiple rewards", () => {
            it("returns false and logs an error", () => {
                newChain.addBlock({ data: [transaction, rewardTransaction, rewardTransaction] });

                expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);

                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe("and the transaction data has at least one malformed outputMap", () => {
            describe("and the transaction IS NOT a reward transaction", () => {
                it("returns false and logs an error", () => {
                    transaction.outputMap[wallet.publicKey] = 666666;

                    newChain.addBlock({ data: [transaction, rewardTransaction] });

                    expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe("and the transaction IS a reward transaction", () => {
                it("returns false and logs an error", () => {
                    rewardTransaction.outputMap[wallet.publicKey] = 666666;

                    newChain.addBlock({ data: [transaction, rewardTransaction] });

                    expect(blockchain.validTransactionData({ 
                        chain: newChain.chain 
                    })).toBe(false);

                    expect(errorMock).toHaveBeenCalled();
                });
            });
        });

        describe("and the transaction data has at least one malfored input", () => {
            it("returns false and logs an error", () => {
                wallet.balance = 9500;

                const temperedOutputMap = {
                    [wallet.publicKey]: 9400,
                    testRecipient: 100
                };

                const temperedTransaction = {
                    input: {
                        timestamp: Date.now(),
                        amount: wallet.balance,
                        address: wallet.publicKey,
                        signature: wallet.sign(temperedOutputMap)
                    },
                    outputMap: temperedOutputMap
                }

                newChain.addBlock({
                    data: [temperedTransaction, rewardTransaction]
                });

                expect(blockchain.validTransactionData({ 
                    chain: newChain.chain 
                })).toBe(false);

                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe("and the transaction contains multiple identical transactions", () => {
            it("returns false and logs an error", () => {
                newChain.addBlock({
                    data: [transaction, transaction, transaction, rewardTransaction]
                });

                expect(blockchain.validTransactionData({ 
                    chain: newChain.chain 
                })).toBe(false);

                expect(errorMock).toHaveBeenCalled();
            });
        });
    });
});