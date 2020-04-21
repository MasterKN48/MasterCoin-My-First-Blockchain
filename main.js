const SHA256 = require("crypto-js/sha256");
class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }
  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }
  createGenesisBlock() {
    return new Block(0, "01/01/20", "Genesis block", "0");
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    //newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
    // in future consensus algorthims will be added
    this.chain.push(newBlock);
  }
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        //console.log("object1");
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        //console.log("object");
        return false;
      }
    }
    return true;
  }
}

let masterCoin = new Blockchain();
console.log("Mining Block 1...");
masterCoin.addBlock(new Block(1, "10/01/2020", { amount: 4 }));
console.log("Mining Block 2...");
masterCoin.addBlock(new Block(2, "10/02/2020", { amount: 12 }));

//console.log(JSON.stringify(masterCoin, null, 4));
console.log("Is Blockchain valid? " + masterCoin.isChainValid());

// masterCoin.chain[1].data = { amount: 100 };
// masterCoin.chain[1].hash = masterCoin.chain[1].calculateHash();

// console.log("Is Blockchain valid? " + masterCoin.isChainValid());
