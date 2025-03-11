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
      res.status(201).json(cuisine);
    } catch (error) {
      console.log("~ CuisineController ~ createCuisine ~ error:", error);
      next(error);
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
      next(error);
    }
  }

  static async getCuisineById(req, res) {
    try {
      let { id } = req.params;

      let cuisine = await Cuisine.findByPk(id);
      if (!cuisine) {
        next({ name: "NotFound", message: "Data not found" });
        return;
      }

      res.status(200).json(cuisine);
    } catch (error) {
      console.log("~ CuisineController ~ getCuisines ~ error:", error);
      next(error);
    }
  }

  static async editCuisineById(req, res) {
    try {
      const { name, description, price, imgUrl, categoryId, authorId } =
        req.body;

      let cuisine = req.cuisine;
      if (!cuisine) {
        return;
      }

      await cuisine.update({
        name,
        description,
        price,
        imgUrl,
        categoryId,
        authorId,
      });

      res.status(200).json(cuisine);
    } catch (error) {
      console.log("~ CuisineController ~ editCuisineById ~ error:", error);
      next(error);
    }
  }

  static async deleteCuisineById(req, res) {
    try {
      let { id } = req.params;

      let cuisine = req.cuisine;
      if (!cuisine) {
        return;
      }
      await cuisine.destroy();

      res.status(200).json(cuisine);
    } catch (error) {
      console.log("~ CuisineController ~ deleteCuisineById ~ error:", error);
      next(error);
    }
  }
}
module.exports = CuisineController;
