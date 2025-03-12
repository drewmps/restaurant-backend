const { Cuisine, User } = require("../models");

const cloudinary = require("cloudinary").v2;
const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY_CLOUDINARY = process.env.API_KEY_CLOUDINARY;
const API_SECRET_CLOUDINARY = process.env.API_SECRET_CLOUDINARY;
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY_CLOUDINARY,
  api_secret: API_SECRET_CLOUDINARY,
});

class CuisineController {
  static async createCuisine(req, res, next) {
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

  static async getCuisines(req, res, next) {
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

  static async getCuisineById(req, res, next) {
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

  static async editCuisineById(req, res, next) {
    try {
      const { name, description, price, imgUrl, categoryId, authorId } =
        req.body;

      let cuisine = req.cuisine;
      if (!cuisine) {
        next({ name: "NotFound", message: "Data not found" });
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

  static async deleteCuisineById(req, res, next) {
    try {
      let { id } = req.params;

      let cuisine = req.cuisine;
      if (!cuisine) {
        next({ name: "NotFound", message: "Data not found" });
        return;
      }
      await cuisine.destroy();

      res.status(200).json(cuisine);
    } catch (error) {
      console.log("~ CuisineController ~ deleteCuisineById ~ error:", error);
      next(error);
    }
  }

  static async editImageUrlById(req, res, next) {
    try {
      let cuisine = req.cuisine;
      if (!cuisine) {
        next({ name: "NotFound", message: "Data not found" });
        return;
      }

      if (!req.file) {
        throw {
          name: "ValidationError",
          errors: [{ message: "File is required" }],
        };
      }

      const mimeType = req.file.mimetype;
      const base64Image = req.file.buffer.toString("base64");
      const result = await cloudinary.uploader.upload(
        `data:${mimeType};base64,${base64Image}`,
        {
          folder: "hck-81",
          public_id: req.file.originalname,
        }
      );

      await cuisine.update({
        imgUrl: result.secure_url,
      });

      res.status(200).json({
        message: "Image cuisine success to update",
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = CuisineController;
