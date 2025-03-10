const express = require("express");
const CuisineController = require("./controllers/CuisineController");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
