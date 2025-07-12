const subscribeOndcTemplate = (signedRequestId) => {
  return `<html>
  <head>
    <meta
      name="ondc-site-verification"
      content="${signedRequestId}"
    />
  </head>
  <body>
    ONDC Site Verification Page
  </body>
</html>
`;
};

module.exports = {
  subscribeOndcTemplate,
};
