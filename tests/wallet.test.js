const Wallet = require("../wallet/index");
const Transaction = require("../wallet/transaction");
const { verifySignature } = require("../utils")
const Blockchain = require("../blockchain");
const { STARTING_BALANCE } = require("../config");

describe("Wallet", () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    it ("has a `balance`", () => {
        expect(wallet).toHaveProperty("balance");
    })

    it ("has a `publicKey`", () => {
        console.log(wallet.publicKey);

        expect(wallet).toHaveProperty("publicKey");
    });

    describe("signing data", () => {
        const data = "foobar";

        it("verifies a signature", () => {
            expect (
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: wallet.sign(data) 
                })
            ).toBe(true);
        });

        it("doesn't verify an invalid signature", () =>{
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: new Wallet().sign(data)
                })
            ).toBe(false);
        });
    });

    describe("createTransaction", () => {
        describe("and the amount exceeds the balance", () => {
            it("throws an error", () => {
                expect(() => wallet.createTransaction({ amount: 999999, recipient: "test-address" }))
                    .toThrow("Amount exceeds balance!");
            });
        });

        describe("and the amount is valid", () => {

            let transaction, amount, recipient;

            beforeEach(() => {
                amount = 50,
                recipient = "test-address",
                transaction = wallet.createTransaction({ amount, recipient })
            });

            it("creates an instance of `Transaction`", () => {
                expect(transaction instanceof Transaction).toBe(true);
            });

            it("matches the transaction input with the wallet", () => {
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });

            it("outputs the amount of the recipient", () => {
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });

        describe("and a chain is passed", () => {
            it("calls `Wallet.calculateBalance`", () => {
                const calculateBalanceTest = jest.fn();

                const trueCalculateBalance = Wallet.calculateBalance;

                Wallet.calculateBalance = calculateBalanceTest;

                wallet.createTransaction({
                    recipient: "test",
                    amount: 50,
                    chain: new Blockchain().chain
                });

                expect(calculateBalanceTest).toHaveBeenCalled();

                Wallet.calculateBalance = trueCalculateBalance;
            });
        });
    });

    describe("calculateBalance()", () => {
        let blockchain ;

        beforeEach(() => {
            blockchain = new Blockchain();
        });

        describe("and there are no outputs for the wallet", () => {
            it("returns the `STARTING_BALANCE`", () => {
                expect(
                    Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey
                    })
                ).toEqual(STARTING_BALANCE);
            });
        });

        describe("and there ARE outputs for the wallet", () => {
            let firstTransaction, secondTransaction;

            beforeEach(() => {
                firstTransaction = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 50
                });

                secondTransaction = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 30
                });

                blockchain.addBlock({ data: [firstTransaction, secondTransaction] });
            });

            it("adds the sum of all outputs to the wallet balance", () => {
                expect(
                    Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey
                    })
                ).toEqual(
                    STARTING_BALANCE + 
                    firstTransaction.outputMap[wallet.publicKey] +
                    secondTransaction.outputMap[wallet.publicKey]
                );
            });

            describe("and the wallet concludes a transaction", () => {
                let recentTransaction;

                beforeEach(() => {
                    recentTransaction = wallet.createTransaction({
                        recipient: "test-address",
                        amount: 50
                    });

                    blockchain.addBlock({ data: [recentTransaction] });
                });

                it("returns the output amount of the most recentTransaction", () => {
                    expect(
                        Wallet.calculateBalance({
                            chain: blockchain.chain,
                            address: wallet.publicKey
                        })
                    ).toEqual(recentTransaction.outputMap[wallet.publicKey]);
                });

                describe("and there are outputs next to and after the most recentTransaction", () => {
                    let sameBlockTransaction, nextBlockTransaction;

                    beforeEach(() => {
                        recentTransaction = wallet.createTransaction({
                            recipient: "most-recent-test-address",
                            amount: 80
                        });

                        sameBlockTransaction = Transaction.rewardTransaction({ minerWallet: wallet });

                        blockchain.addBlock({ data: [recentTransaction, sameBlockTransaction] });

                        nextBlockTransaction = new Wallet().createTransaction({
                            recipient: wallet.publicKey,
                            amount: 110
                        });

                        blockchain.addBlock({ data: [nextBlockTransaction] });
                    });

                    it("includes the output amounts in the returned balance", () => {
                        expect(
                            Wallet.calculateBalance({
                                chain: blockchain.chain,
                                address: wallet.publicKey
                            })
                        ).toEqual(
                            recentTransaction.outputMap[wallet.publicKey] +
                            sameBlockTransaction.outputMap[wallet.publicKey] +
                            nextBlockTransaction.outputMap[wallet.publicKey]
                        );
                    });
                });
            });
        });
    });
});