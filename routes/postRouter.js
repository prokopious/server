const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
var passport = require("passport")
var authenticate = require("../authenticate")

const Posts = require("../models/posts")

const postRouter = express.Router()

postRouter.use(bodyParser.json())

postRouter
  .route("/")
  .get((req, res, next) => {
    Posts.find({})
      .populate("comments.author")
      .then(
        posts => {
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(posts)
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Posts.create(req.body)
      .then(
        post => {
          console.log("post Created ", post)
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(post)
        },
        err => {
          res.status(500).send(err)
        }
      )
      .catch(err => {
        next(err)
      })
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end("PUT operation not supported on /posts")
  })
  .delete(
    authenticate.verifyUser,

    (req, res, next) => {
      Posts.remove({})
        .then(
          resp => {
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.json(resp)
          },
          err => next(err)
        )
        .catch(err => {
          console.log("shit" + err.message)
          next(err)
        })
    }
  )

postRouter
  .route("/:postId")
  .get((req, res, next) => {
    Posts.findById(req.params.postId)
      .then(
        post => {
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(post)
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end("POST operation not supported on /posts/" + req.params.postId)
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Posts.findOneAndUpdate(
      req.params.postId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        post => {
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(post)
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Posts.findByIdAndRemove(req.params.postId)
        .then(
          resp => {
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.json(resp)
          },
          err => next(err)
        )
        .catch(err => next(err))
    }
  )

module.exports = postRouter
