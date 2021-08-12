const crypto = require("crypto");

const algorithm = "aes-256-cbc";

const encrypt = (v, iv, k) => {
    const hash = crypto.createHash("sha256");
    hash.update(k);

    const cipher = crypto.createCipheriv(algorithm, hash.digest(), iv);

    return cipher.update(v, "utf-8", "hex") + cipher.final("hex");
};

const decrypt = (v, iv, k) => {
    const hash = crypto.createHash("sha256");
    hash.update(k);

    const cipher = crypto.createDecipheriv(algorithm, hash.digest(), iv);

    return cipher.update(v, "hex", "utf-8") + cipher.final("utf8");
};

module.exports = { encrypt, decrypt };
