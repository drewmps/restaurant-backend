async function guardAdmin(req, res, next) {
  if (req.user.role === "Admin") {
    next();
  } else {
    next({ name: "Forbidden", message: "Forbidden access" });
    return;
  }
}
module.exports = guardAdmin;
