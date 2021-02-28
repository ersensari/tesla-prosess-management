const { createCipheriv, createDecipheriv } = require("crypto");

const algorithm = "aes-256-ctr";
const secretKey = "C2l&T03#0ZExamZen%7ibnHZnxFrDRgz";
const iv = Buffer.from("137e714d6692d80d8d88d49f4070a8bb", "hex");

module.exports = {
  encrypt: (text) => {
    const cipher = createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return encrypted.toString("hex");
  },

  decrypt: (hash) => {
    const decipher = createDecipheriv(
      algorithm,
      secretKey,
      Buffer.from(hash.iv, "hex")
    );

    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(hash.content, "hex")),
      decipher.final(),
    ]);

    return decrpyted.toString();
  },
};
