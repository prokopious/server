const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Dishes = require("../models/dishes")
const Favorites = require("../models/favorite")
var authenticate = require("../authenticate")
const favoriteRouter = express.Router()
favoriteRouter.use(bodyParser.json())

favoriteRouter
  .route("/")
  .get(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate("user")
      .populate("dishes")
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
              if (item.dishes.indexOf(n) === -1) {
                item.dishes.push(n)
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
            Favorites.create({ user: req.user._id, dishes: req.body }).then(
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
  .route("/:dishId")
  .options((req, res) => {
    res.sendStatus(200)
  })
  .get(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end(req.params.dishId)
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        item => {
          if (item) {
            if (item.dishes.indexOf(req.params.dishId) === -1) {
              item.dishes.push(req.params.dishId)
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
              dishes: [req.params.dishId],
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
    res.end(req.params.dishId)
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        item => {
          if (item) {
            index = item.dishes.indexOf(req.params.dishId)
            if (index >= 0) {
              item.dishes.splice(index, 1)
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
