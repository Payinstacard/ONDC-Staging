const _sodium = require("libsodium-wrappers");
const crypto = require("crypto");

const signMessage = async (signingString, privateKey) => {
  await _sodium.ready;
  const sodium = _sodium;
  const signedMessage = sodium.crypto_sign_detached(
    signingString,
    sodium.from_base64(privateKey, _sodium.base64_variants.ORIGINAL)
  );
  const signature = sodium.to_base64(
    signedMessage,
    _sodium.base64_variants.ORIGINAL
  );
  return signature;
};

function decryptAES256ECB(key, encrypted) {
  const iv = Buffer.alloc(0);
  const decipher = crypto.createDecipheriv("aes-256-ecb", key, iv);
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

const privateKey = crypto.createPrivateKey({
  key: Buffer.from(process.env.ENC_PRIVATE_KEY, "base64"),
  format: "der",
  type: "pkcs8",
});

const publicKey = crypto.createPublicKey({
  key: Buffer.from(process.env.ONDC_PUBLIC_KEY, "base64"),
  format: "der",
  type: "spki",
});

const sharedKey = crypto.diffieHellman({
  privateKey: privateKey,
  publicKey: publicKey,
});

module.exports = {
  signMessage,
  decryptAES256ECB,
  sharedKey,
  privateKey,
};
