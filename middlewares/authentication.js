const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");
async function authentication(req, res, next) {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  const [, token] = bearerToken.split(" ");
  if (!token) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  try {
    const data = verifyToken(token);
    const user = await User.findByPk(data.id);

    if (!user) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
module.exports = authentication;
