require("dotenv/config.js");
const signedPrivateKey = process.env.SIGNING_PRIVATE_KEY;
const express = require("express");
const {
  generateRequestUUID,
} = require("./utils/generate-random-unique-ids.js");
const { signMessage, sharedKey } = require("./utils/ondc");
const { subscribeOndcTemplate } = require("./templates/subscribe-ondc.js");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.get("/", (req, res) => res.send("Hello World!"));
app.get("/health", (req, res) => res.send("Health OK!!"));

app.post("/on_subscribe", function (req, res) {
  const { challenge } = req.body;
  console.log("ON SUBSCRIBE", challenge);
  const answer = decryptAES256ECB(sharedKey, challenge);
  const resp = { answer: answer };
  console.log("ANSWER", answer);
  res.status(200).json(resp);
});

app.get("/ondc-site-verification.html", async (req, res) => {
  const requestId = generateRequestUUID();
  console.log("REQUEST ID", requestId);
  const signedContent = await signMessage(requestId, signedPrivateKey);
  const modifiedHTML = subscribeOndcTemplate(signedContent);
  console.log(modifiedHTML);
  res.send(modifiedHTML);
});

app.listen(process.env.PORT || 4000, () =>
  console.log(`App listening on port ${process.env.PORT || 4000}!`)
);
