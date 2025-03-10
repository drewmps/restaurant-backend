const { Cuisine, User } = require("../models");
class CuisineController {
  static async createCuisine(req, res) {
    try {
      const { name, description, price, imgUrl, categoryId, authorId } =
        req.body;
      const cuisine = await Cuisine.create({
        name,
        description,
        price,
        imgUrl,
        categoryId,
        authorId,
      });
      res.status(201).json({ message: "Cuisine created", data: cuisine });
    } catch (error) {
      console.log("~ CuisineController ~ createCuisine ~ error:", error);
      if (error.name === "SequelizeValidationError") {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}
module.exports = CuisineController;
