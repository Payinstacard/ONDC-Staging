const crypto = require("crypto");
const nacl = require("tweetnacl");

const fetchLookup = async (req, res) => {
  try {
    const keyId = "ondc.payinstacard.com";
    const uniqueKeyId = "cc386042-01ce-42f5-b32d-5c5f7019f68e";
    const algorithm = "ed25519";
    const now = new Date();
    const created = Math.floor(now.getTime() / 1000);
    const expires = created + 86400;
    const body = JSON.stringify({
      country: "IND",
      domain: "ONDC:TRV11",
    });

    const digest = crypto.createHash("sha256").update(body).digest("base64");
    const digestHeader = `SHA-256=${digest}`;

    const signingString = `(created):${created}\n(expires):${expires}\ndigest:${digestHeader}`;

    const privateKeyBase64 =
      "SXwFwl+f8Lcg5Z+8ktaOY9TXtAvIxoe36dFZz/hCOdoA37Ze5j3GcNEL87RjERwfdG8iWzJPhlCZLUQ1GDkBzQ==";
    const privateKeyUint8 = Buffer.from(privateKeyBase64, "base64");

    const signature = nacl.sign.detached(
      Buffer.from(signingString, "utf-8"),
      privateKeyUint8
    );

    const signatureBase64 = Buffer.from(signature).toString("base64");

    const authorization = `Signature keyId='${keyId}|${uniqueKeyId}|${algorithm}',algorithm='${algorithm}',created=${created},expires=${expires},headers='(created)(expires)digest',signature='${signatureBase64}'`;

    console.log(authorization);

    const response = await fetch(
      "https://staging.registry.ondc.org/v2.0/lookup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        body,
      }
    );

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error during fetchLookup:", error);
  }
};

fetchLookup();
