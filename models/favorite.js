const mongoose = require("mongoose")
const Schema = mongoose.Schema

var favoriteSchema = new Schema(
  {
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
)

const Favorites = mongoose.model("Favorite", favoriteSchema)

module.exports = Favorites
