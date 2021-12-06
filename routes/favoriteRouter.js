const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Posts = require("../models/posts")
const Favorites = require("../models/favorite")
var authenticate = require("../authenticate")
const favoriteRouter = express.Router()
favoriteRouter.use(bodyParser.json())

favoriteRouter
  .route("/")
  .get(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate("user")
      .populate("posts")
      .then(
        favorites => {
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(favorites)
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        item => {
          if (item) {
            for (var i = 0; i < req.body.length; i++) {
              let n = req.body[i]._id
              if (item.posts.indexOf(n) === -1) {
                item.posts.push(n)
              }
            }
            item.save().then(
              item => {
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.json(item)
              },
              err => next(err)
            )
          } else {
            Favorites.create({ user: req.user._id, posts: req.body }).then(
              item => {
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.json(favorite)
              },
              err => next(err)
            )
          }
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end("PUT operation not supported on /favorites")
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({ user: req.user._id })
      .then(
        responze => {
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(responze)
        },
        err => next(err)
      )
      .catch(err => next(err))
  })

favoriteRouter
  .route("/:postId")
  .options((req, res) => {
    res.sendStatus(200)
  })
  .get(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end(req.params.postId)
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        item => {
          if (item) {
            if (item.posts.indexOf(req.params.postId) === -1) {
              item.posts.push(req.params.postId)
              item.save().then(
                item => {
                  res.statusCode = 200
                  res.setHeader("Content-Type", "application/json")
                  res.json(item)
                },
                err => next(err)
              )
            }
          } else {
            Favorites.create({
              user: req.user._id,
              posts: [req.params.postId],
            }).then(
              item => {
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.json(favorite)
              },
              err => next(err)
            )
          }
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end(req.params.postId)
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        item => {
          if (item) {
            index = item.posts.indexOf(req.params.postId)
            if (index >= 0) {
              item.posts.splice(index, 1)
              item.save().then(
                item => {
                  res.statusCode = 200
                  res.setHeader("Content-Type", "application/json")
                  res.json(item)
                },
                err => next(err)
              )
            } else {
              err = new Error("error")
              err.status = 404
              return next(err)
            }
          } else {
            err = new Error("error")
            err.status = 404
            return next(err)
          }
        },
        err => next(err)
      )
      .catch(err => next(err))
  })

module.exports = favoriteRouter
