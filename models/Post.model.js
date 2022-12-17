const { Schema, model } = require("mongoose");

const newPost = new Schema(
  {
    comment: {
      type: String,
      minLength: 1,
      maxLength: 100,
    },
    _commentedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    _newsId: {
      type: Schema.Types.ObjectId,
      ref: "News",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Post", newPost);
