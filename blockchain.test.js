const Blockchain = require("./blockchain");
const singleBlock = require("./singleBlock");

describe("Blockchain", () => {
    let blockchain = new Blockchain();

    beforeEach(() => {
        blockchain = new Blockchain();
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

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
});