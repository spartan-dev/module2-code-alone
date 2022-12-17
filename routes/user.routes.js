const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn"); // me va ayudar pasaber si tengo una session

router.get("/profile", isLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  console.log("hola", user);
  res.render("profile", { user });
});

module.exports = router;
