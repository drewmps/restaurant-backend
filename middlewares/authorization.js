const { Cuisine } = require("../models");
async function authorization(req, res, next) {
  let id = +req.params.id;

  try {
    let cuisine = await Cuisine.findByPk(id);

    if (!cuisine) {
      res.status(404).json({ message: "Error not found" });
      return;
    }

    if (req.user.role === "Staff") {
      if (cuisine.authorId !== req.user.id) {
        res.status(403).json({ message: "Forbidden access" });
        return;
      }
    }

    req.cuisine = cuisine;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}
module.exports = authorization;
