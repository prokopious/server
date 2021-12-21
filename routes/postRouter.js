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
          next(err)})
    }
  )

postRouter
  .route("/:slug")
  .get((req, res, next) => {
    Posts.find({slug: req.params.slug})
      .populate("comments.author")
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
    Posts.findByIdAndUpdate(
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

postRouter
  .route("/:postId/comments")
  .get((req, res, next) => {
    Posts.findById(req.params.postId)
      .populate("comments.author")
      .then(
        post => {
          if (post != null) {
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.json(post.comments)
          } else {
            err = new Error("post " + req.params.postId + " not found")
            err.status = 404
            return next(err)
          }
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Posts.findById(req.params.postId)
      .then(
        post => {
          if (post != null) {
            req.body.author = req.user._id
            post.comments.push(req.body)
            post.save().then(
              post => {
                Posts.findById(post._id)
                  .populate("comments.author")
                  .then(post => {
                    res.statusCode = 200
                    res.setHeader("Content-Type", "application/json")
                    res.json(post)
                  })
              },
              err => next(err)
            )
          } else {
            err = new Error("post " + req.params.postId + " not found")
            err.status = 404
            return next(err)
          }
        },
        err => next(err)
      )
      .catch(err => next(err))
  })

  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end(
      "PUT operation not supported on /posts/" + req.params.postId + "/comments"
    )
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Posts.findById(req.params.postId)
        .then(
          post => {
            if (post != null) {
              for (var i = post.comments.length - 1; i >= 0; i--) {
                post.comments.id(post.comments[i]._id).remove()
              }
              post.save().then(
                post => {
                  res.statusCode = 200
                  res.setHeader("Content-Type", "application/json")
                  res.json(post)
                },
                err => next(err)
              )
            } else {
              err = new Error("post " + req.params.postId + " not found")
              err.status = 404
              return next(err)
            }
          },
          err => next(err)
        )
        .catch(err => next(err))
    }
  )

postRouter
  .route("/:postId/comments/:commentId")
  .get((req, res, next) => {
    Posts.findById(req.params.postId)
      .populate("comments.author")
      .then(
        post => {
          if (post != null && post.comments.id(req.params.commentId) != null) {
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.json(post.comments.id(req.params.commentId))
          } else if (post == null) {
            err = new Error("post " + req.params.postId + " not found")
            err.status = 404
            return next(err)
          } else {
            err = new Error("Comment " + req.params.commentId + " not found")
            err.status = 404
            return next(err)
          }
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end(
      "POST operation not supported on /posts/" +
        req.params.postId +
        "/comments/" +
        req.params.commentId
    )
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Posts.findById(req.params.postId)
      .then(
        post => {
          if (
            post != null &&
            post.comments.id(req.params.commentId) != null &&
            post.comments.id(req.params.commentId).author == req.user._id
          ) {
            if (req.body.rating) {
              post.comments.id(req.params.commentId).rating = req.body.rating
            }
            if (req.body.comment) {
              post.comments.id(req.params.commentId).comment = req.body.comment
            }
            post.save().then(
              post => {
                Posts.findById(post._id)
                  .populate("comments.author")
                  .then(post => {
                    res.statusCode = 200
                    res.setHeader("Content-Type", "application/json")
                    res.json(post)
                  })
              },
              err => next(err)
            )
          } else if (post == null) {
            err = new Error("post " + req.params.postId + " not found")
            err.status = 404
            return next(err)
          } else {
            err = new Error("Comment " + req.params.commentId + " not found")
            err.status = 404
            return next(err)
          }
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Posts.findById(req.params.postId)
        .then(
          post => {
            if (
              post != null &&
              post.comments.id(req.params.commentId) != null &&
              post.comments.id(req.params.commentId).author == req.user._id
            ) {
              post.comments.id(req.params.commentId).remove()
              post.save().then(
                post => {
                  Posts.findById(post._id)
                    .populate("comments.author")
                    .then(post => {
                      res.statusCode = 200
                      res.setHeader("Content-Type", "application/json")
                      res.json(post)
                    })
                },
                err => next(err)
              )
            } else if (post == null) {
              err = new Error("post " + req.params.postId + " not found")
              err.status = 404
              return next(err)
            } else {
              err = new Error("Comment " + req.params.commentId + " not found")
              err.status = 404
              return next(err)
            }
          },
          err => next(err)
        )
        .catch(err => next(err))
    }
  )

module.exports = postRouter