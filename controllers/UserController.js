const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
class UserController {
  static async addUser(req, res) {
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
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        let listErrors = error.errors.map((el) => {
          return el.message;
        });
        res.status(400).json({ validationError: listErrors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      let errorValidation = [];
      if (!email) {
        errorValidation.push("Email is required");
      }
      if (!password) {
        errorValidation.push("Password is required");
      }
      if (errorValidation.length > 0) {
        throw {
          name: "ValidationError",
          errors: errorValidation,
        };
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ message: "Invalid email/password" });
        return;
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: "Invalid email/password" });
        return;
      }

      const access_token = signToken({ id: user.id, role: user.role });
      res.status(200).json({
        access_token,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        res.status(400).json({ validationError: error.errors });
      } else {
        res.json(500).json({ message: "Internal Server Error" });
      }
    }
  }
}
module.exports = UserController;
