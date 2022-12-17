const express = require('express');
const router = express.Router();
const News = require("../models/News.model")
const isLoggedIn = require("../middleware/isLoggedIn")
/* GET home page */
router.get("/", isLoggedIn ,async  (req, res, next) => {
  try{
    const user = req.session.currentUser
    const news = await News.find().populate("_owner", "username email avatar")
    console.log("El news",news)
    res.render("index",{ news,user });
  }catch(error){
    next(error)
  }
});

module.exports = router;
