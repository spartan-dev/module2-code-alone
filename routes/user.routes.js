const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn"); // me va ayudar pasaber si tengo una session
const News = require("../models/News.model");
router.get("/profile", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  let our_News = await News.find({ _owner: user._id });
  console.log(our_News, "sin id");
  res.render("profile", { user, our_News });
});

module.exports = router;
