const { Category } = require("../models");
class CategoryController {
  static async createCategory(req, res) {
    try {
      const { name } = req.body;
      const category = await Category.create({
        name,
      });
      res.status(201).json(category);
    } catch (error) {
      console.log("~ CategoryController ~ createCategory ~ error:", error);
      if (error.name === "SequelizeValidationError") {
        let err = error.errors.map((el) => {
          return el.message;
        });
        res.status(400).json({ validationErrors: err });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async getCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      console.log("~ CategoryController ~ getCategories ~ error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
module.exports = CategoryController;
