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
        let err = error.errors.map((el) => {
          return el.message;
        });
        res.status(400).json({ validationErrors: err });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async getCuisines(req, res) {
    try {
      const cuisines = await Cuisine.findAll({
        include: {
          model: User,
          attributes: {
            exclude: "password",
          },
        },
      });
      res.status(200).json(cuisines);
    } catch (error) {
      console.log("~ CuisineController ~ getCuisines ~ error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getCuisineById(req, res) {
    try {
      let { id } = req.params;

      let cuisine = await Cuisine.findByPk(id);
      if (!cuisine) {
        res.status(404).json({ message: "Error not found" });
        return;
      }

      res.status(200).json({ data: cuisine });
    } catch (error) {
      console.log("~ CuisineController ~ getCuisines ~ error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
module.exports = CuisineController;
