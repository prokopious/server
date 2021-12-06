const mongoose = require("mongoose")
const Schema = mongoose.Schema

require("mongoose-currency").loadType(mongoose)
const Currency = mongoose.Types.Currency

var tagSchema = new Schema(
  {
    tag: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

var commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
)

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: "",
    },
    comments: [commentSchema],
    tags: [tagSchema],
  },
  {
    timestamps: true,
  }
)

var Posts = mongoose.model("Post", postSchema)

module.exports = Posts
