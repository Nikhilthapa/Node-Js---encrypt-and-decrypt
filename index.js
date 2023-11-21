const crypto = require("crypto");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(5001, () => {
  console.log("server running on the port 5001");
});
const keymsg = "hello";
const Ivmsg = "there";
encryption_method = "aes-256-cbc";
const key = crypto
  .createHash("sha512")
  .update(keymsg)
  .digest("hex")
  .substring(0, 32);
// key.update(keymsg);
// const digit = key.digest("hex");
// console.log(digit.substring(0, 32));

const encryptionIV = crypto
  .createHash("sha512")
  .update(Ivmsg)
  .digest("hex")
  .substring(0, 16);
// encryptionIV.update(Ivmsg);
// const encrypt = encryptionIV.digest("hex");
// console.log(encrypt.substring(0, 32));

const encrption = async (data) => {
  try {
    const cipher = await crypto.createCipheriv(
      "aes-256-cbc",
      key,
      encryptionIV
    );
    return Buffer.from(
      cipher.update(data, "utf8", "hex") + cipher.final("hex")
    ).toString("base64");
  } catch (error) {
    console.log(error.message);
  }
};

const decryptdata = (encrption) => {
  try {
    const buffer = Buffer.from(encrption, "base64");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, encryptionIV);
    return (
      decipher.update(buffer.toString("utf8"), "hex", "utf8") +
      decipher.final("utf8")
    );
  } catch (error) {
    console.log(error.message);
  }
};

app.post("/encrypt", async (req, res) => {
  const { data } = req.body;
  console.log(req.body);
  const encrptiondata = await encrption(data);
  //   let a = JSON.stringify(encrptiondata);
  console.log(encrptiondata);
  res.json({ encrptiondata });
});
app.post("/decrypt", (req, res) => {
  const { data } = req.body;
  //   console.log(encrypt);
  const response = decryptdata(data);
  //   let a = JSON.stringify(encrptiondata);
  //   console.log(data);
  res.json({ response });
});
