const jwt = require("jsonwebtoken");

const createToken = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFE_TIME,
  });
  return token;
};

const verifyToken = ({ payload }) =>
  jwt.verify(payload, process.env.JWT_SECRET);

module.exports = { createToken, verifyToken };
