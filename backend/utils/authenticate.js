const { verifyToken } = require("./token");
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authentication failed: Token missing" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const { email, id, role } = verifyToken({ payload: token });
    req.user = { email, id, role };
    next();
  } catch (err) {
    return res.status(500).json({ error: "Token invalid" });
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(500).json("Unauthorized to access this route");
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
