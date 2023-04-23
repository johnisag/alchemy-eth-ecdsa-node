const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const PRIVATE_KEY =
  "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";

const publicKey = secp.getPublicKey(PRIVATE_KEY);
console.log("publicKey: ", toHex(publicKey));

const hash_msg = keccak256(utf8ToBytes("hello"));
//console.log("hash msg: ", hash_msg);

const signature_promise = secp.sign(hash_msg, PRIVATE_KEY, { recovered: true });

signature_promise.then((signature) => {
  console.log("signature: ", signature[0]);
  const public_key = secp.recoverPublicKey(
    hash_msg,
    signature[0],
    signature[1]
  );
  console.log("recovered: ", toHex(public_key));
});

// console.log("recovered: ", recovered);
//console.log("recovered: ", toHex(recovered));
