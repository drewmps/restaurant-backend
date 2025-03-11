const express = require("express");
const CuisineController = require("./controllers/CuisineController");
const CategoryController = require("./controllers/CategoryController");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/cuisines", CuisineController.createCuisine);
app.get("/cuisines", CuisineController.getCuisines);
app.get("/cuisines/:id", CuisineController.getCuisineById);
app.put("/cuisines/:id", CuisineController.editCuisineById);
app.delete("/cuisines/:id", CuisineController.deleteCuisineById);

app.post("/categories", CategoryController.createCategory);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
