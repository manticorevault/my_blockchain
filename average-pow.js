const Blockchain = require("./blockchain");

const blockchain = new Blockchain();

blockchain.addBlock({ data: "initial" });

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;

const times = [];

for (let counter = 0; counter < 10000; counter++) {
    prevTimestamp = blockchain.chain[blockchain.chain.length-1].timestamp;

    blockchain.addBlock({ data: `block ${counter}` });
    nextBlock = blockchain.chain[blockchain.chain.length-1];

    nextTimestamp = nextBlock.timestamp;
    timeDiff = nextTimestamp - prevTimestamp;
    times.push(timeDiff);

    average = times.reduce((total, num) => (total + num))/times.length;

    console.log(`Time needed to mine a block: ${timeDiff}ms. The difficulty was set to ${nextBlock.difficulty}. Average time was ${average}ms`)
}