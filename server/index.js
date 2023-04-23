const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "04c43f811af77853f421195f1603ae880b3f76739ec93226c3c53dc9d14678c04b7757416e3c12cd4e29b332aab02e8df3cb05db3718da8da9766670d4419b9d91": 100, // 567be6d52b564e20049512f6015439dab2f24333c698ab6f3bb97a91cf7e70c6
  "04b010aa461a904acf9ce8e3612313fb66d2801d4ceae71c274215b139c7d91bc46b0b526ad1f365cafd010d9721eea549129c5a508f50c14a9a6ec32b7377c38c": 50, //  da4279624ad3db1e8b177887b8f7ccbb714f8c160e6cb6dc644f701f5c06e99d
  "0457846dca5a27987115420f4675e1a86d5c750e8b4150d1ad14b6b31359f9ec99facfb6ef8e74f1ef48de45e8f854ec0f762a4da89e375489901aa5024b5090c1": 75, //  d54d1c09ab446617ddf77ce523161848634ad300ab510865cd6e2ec7ac9b6280
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, signature, recovery_bit } = req.body;
  console.log("recipient: ", recipient);

  // retrieve sender from signature
  const public_key = secp.recoverPublicKey(
    keccak256(utf8ToBytes(amount.toString())),
    signature,
    recovery_bit
  );
  const sender = toHex(public_key);
  console.log("sender public key: ", sender);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
