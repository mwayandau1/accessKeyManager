const generateKey = () => {
  /**
   * Function for generating the access key token
   * Creates the token and append to company name
   *
   */
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < 32; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return "micro_focus_" + key;
};
module.exports = generateKey;
