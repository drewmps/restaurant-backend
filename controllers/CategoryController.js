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
      next(error);
    }
  }

  static async getCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      console.log("~ CategoryController ~ getCategories ~ error:", error);
      next(error);
    }
  }

  static async editCategoryById(req, res) {
    try {
      let { id } = req.params;
      const { name } = req.body;

      let category = await Category.findByPk(id);
      if (!category) {
        next({ name: "NotFound", message: "Data not found" });
        return;
      }

      await category.update({
        name,
      });

      res.status(200).json(category);
    } catch (error) {
      console.log("~ CategoryController ~ editCategoryById ~ error:", error);
      next(error);
    }
  }
}
module.exports = CategoryController;
