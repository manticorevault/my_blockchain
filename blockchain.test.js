const Blockchain = require("./blockchain");
const singleBlock = require("./singleBlock");

describe("Blockchain", () => {
    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();

        originalChain = blockchain.chain;
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

            describe("the chain works correctly and has no invalid blocks", () => {
                it("returns true", () => {

                    console.log(blockchain.chain)
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

    describe("replaceChain()", () => {
        describe("when the new chain is not longer", () => {
            it("does not replace the chain", () => {
                newChain.chain[0] = { new: "chain" };

                blockchain.replaceChain(newChain.chain);

                expect(blockchain.chain).toEqual(originalChain);
            });
        });

        describe("when the new chain is longer", () => {

            beforeEach(() => {
                newChain.addBlock({ data: "Servant" });
                newChain.addBlock({ data: "Spiderman" });
                newChain.addBlock({ data: "Dune" });
            })

            describe("and then chain is invalid", () => {
                it("does not replace the chain", () => {
                    newChain.chain[2].individualHash = "fake-hash";

                    blockchain.replaceChain(newChain.chain);

                    expect(blockchain.chain).toEqual(originalChain);
                });
            });

            describe("and the chain is valid", () => {
                it("does replace the chain", () => {
                    blockchain.replaceChain(newChain.chain);

                    expect(blockchain.chain).toEqual(newChain.chain);
                });
            });
        });
    });
});