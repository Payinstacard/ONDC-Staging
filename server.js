require("dotenv/config.js");
const signedPrivateKey = process.env.SIGNING_PRIVATE_KEY;
const express = require("express");
const { signMessage, sharedKey, decryptAES256ECB } = require("./utils/ondc.js");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.get("/", (req, res) => res.send("Hello World!"));
app.get("/health", (req, res) => res.send("Health OK!!"));

app.post("/on_subscribe/on_subscribe", function (req, res) {
  const { challenge } = req.body;
  console.log("ON SUBSCRIBE", challenge);
  const answer = decryptAES256ECB(sharedKey, challenge);
  const resp = { answer: answer };
  console.log("ANSWER", answer);
  res.status(200).json(resp);
});

const htmlFile = `
<!--Contents of ondc-site-verification.html. -->
<html>
  <head>
    <meta name="ondc-site-verification" content="SIGNED_UNIQUE_REQ_ID" />
  </head>
  <body>
    ONDC Site Verification Page
  </body>
</html>
`;

app.get("/ondc-site-verification.html", async (req, res) => {
  const requestId = "PAYINSTACARD22072025";
  console.log("REQUEST ID", requestId);
  const signedContent = await signMessage(requestId, signedPrivateKey);
  console.log(signedContent);
  const modifiedHTML = htmlFile.replace(/SIGNED_UNIQUE_REQ_ID/g, signedContent);
  res.send(modifiedHTML);
});

app.listen(process.env.PORT || 4000, () =>
  console.log(`App listening on port ${process.env.PORT || 4000}!`)
);
