const CustomError = require("./customError");
const { verifyToken } = require("./token");
// const Token = require("../models/TokenModel");

// const { attachCookiesToResponse } = require("./token");

const authenticateUser = async (req, res, next) => {
  /**
   * Authentication mechanism
   * @function:Ensures a user is logged to access certain services
   * @params:Takes token from request header
   * @verify:Verify token using a signed jwt key
   * @return:Returns a user if token is valid
   */
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new CustomError("Authentication failed: Token missing", 401));
  }
  const token = authHeader.split(" ")[1];
  try {
    const { email, id, role } = verifyToken({ payload: token });
    req.user = { email, id, role };
    next();
  } catch (err) {
    return next(new CustomError("Token invalid", 401));
  }
};

// const authenticateUser = async (req, res, next) => {
//   /**
//    * Authentication mechanism
//    * @function:Ensures a user is logged to access certain services
//    * @params:Takes token from request header
//    * @verify:Verify token using a signed jwt key
//    * @return:Returns a user if token is valid
//    */
//   const { refreshToken, accessToken } = req.signedCookies;

//   try {
//     if (accessToken) {
//       const decoded = verifyToken({ payload: accessToken });

//       req.user = decoded.user;
//       return next();
//     }
//     const decoded = verifyToken({ payload: refreshToken });

//     //Finds an existing token in the database
//     const existingToken = await Token.findOne({
//       user: decoded.user.id,
//       refreshToken: decoded.refreshToken,
//     });

//     if (!existingToken || !existingToken?.isValid) {
//       return next(new CustomError("Authentication Invalid", 401));
//     }

//     attachCookiesToResponse({
//       res,
//       user: decoded.user,
//       refreshToken: existingToken.refreshToken,
//     });

//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     return next(new CustomError("Authentication Invalid", 401));
//   }
// };

const authorizePermissions = (...roles) => {
  /**
   * Authorization mechanism
   * @function:Gives permission to specified user
   * return:Returns true if user is allow otherwise denies user
   */
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new CustomError("Unauthorized to access this route", 403));
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
