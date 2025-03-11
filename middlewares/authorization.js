const { Cuisine } = require("../models");
async function authorization(req, res, next) {
  let id = +req.params.id;

  try {
    let cuisine = await Cuisine.findByPk(id);

    if (!cuisine) {
      next({ name: "NotFound", message: "Data not found" });
      return;
    }

    if (req.user.role === "Staff") {
      if (cuisine.authorId !== req.user.id) {
        next({ name: "Forbidden", message: "Forbidden access" });
        return;
      }
    }

    req.cuisine = cuisine;
    next();
  } catch (error) {
    next(error);
    return;
  }
}
module.exports = authorization;
