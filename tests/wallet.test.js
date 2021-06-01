const Wallet = require("../wallet/index");
const Transaction = require("../wallet/transaction");
const { verifySignature } = require("../utils")

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
            })

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
    });
});