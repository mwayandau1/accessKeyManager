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

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createToken({ payload: { user } });
  const refreshTokenJWT = createToken({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });
  res.status(200).json({ user, token: accessTokenJWT });
};

module.exports = { createToken, verifyToken, attachCookiesToResponse };
