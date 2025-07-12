const generateRequestUUID = () => {
  let uniqueId = "";
  const alphaNumericValues = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

  for (let i = 0; i < 30; i++) {
    let randomValue = Math.round(Math.random() * 35);
    uniqueId += alphaNumericValues.charAt(randomValue);
  }

  return uniqueId;
};

module.exports = {
  generateRequestUUID,
};
