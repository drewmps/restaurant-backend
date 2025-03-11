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
}
module.exports = UserController;
