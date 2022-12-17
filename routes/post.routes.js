const router = require("express").Router();
const Post = require("../models/Post.model");
const isLoggedIn = require("../middleware/isLoggedIn"); // me va ayudar pasaber si tengo una session
const { create } = require("../models/User.model");

router.post("/create/:blogId", isLoggedIn, async (req, res, next) => {
  const { post } = req.body;
  const { blogId } = req.params;
  const user = req.session.currentUser;

  try {
    const createdPost = await Post.create({
      comment: post,
      _commentedBy: user._id,
      _newsId: blogId,
    });
    res.redirect(`/news/${blogId}/detail`);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
