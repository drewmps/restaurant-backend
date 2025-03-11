const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
class UserController {
  static async addUser(req, res, next) {
    try {
      const { email, password, phoneNumber, address, username } = req.body;

      const user = await User.create({
        email,
        password,
        phoneNumber,
        address,
        username,
      });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      let errorValidation = [];
      if (!email) {
        errorValidation.push({ message: "Email is required" });
      }
      if (!password) {
        errorValidation.push({ message: "Password is required" });
      }
      if (errorValidation.length > 0) {
        next({ name: "ValidationError", errors: errorValidation });
        return;
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        next({ name: "Unauthorized", message: "Invalid email or password" });
        return;
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        next({ name: "Unauthorized", message: "Invalid email or password" });
        return;
      }

      const access_token = signToken({ id: user.id, role: user.role });
      res.status(200).json({
        access_token,
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = UserController;
