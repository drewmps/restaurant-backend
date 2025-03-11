require("dotenv").config();
const express = require("express");
const CuisineController = require("./controllers/CuisineController");
const CategoryController = require("./controllers/CategoryController");
const UserController = require("./controllers/UserController");
const authentication = require("./middlewares/authentication");
const guardAdmin = require("./middlewares/guardAdmin");
const authorization = require("./middlewares/authorization");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/login", UserController.login);

app.use(authentication);
app.post("/cuisines", CuisineController.createCuisine);
app.get("/cuisines", CuisineController.getCuisines);
app.get("/cuisines/:id", CuisineController.getCuisineById);
app.put("/cuisines/:id", authorization, CuisineController.editCuisineById);
app.delete("/cuisines/:id", authorization, CuisineController.deleteCuisineById);

app.post("/categories", CategoryController.createCategory);
app.get("/categories", CategoryController.getCategories);
app.put("/categories/:id", CategoryController.editCategoryById);

app.get("/pub/cuisines", CuisineController.getCuisines);
app.get("/pub/cuisines/:id", CuisineController.getCuisineById);

app.post("/add-user", guardAdmin, UserController.addUser);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
