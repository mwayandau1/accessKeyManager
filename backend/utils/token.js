const jwt = require("jsonwebtoken");

const createToken = ({ payload }) => {
  /**
   * Function for creating jwt token
   * @params:JWT_SECRET, JWT_LIFE_TIME from environment file
   * @return:Return the signed token to user
   */
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFE_TIME,
  });
  return token;
};

//Verifies user token
const verifyToken = ({ payload }) =>
  jwt.verify(payload, process.env.JWT_SECRET);

module.exports = { createToken, verifyToken };
