const express = require("express")
const bodyParser = require("body-parser")
const Jobs = require("../models/jobs")
var authenticate = require("../authenticate")
const jobRouter = express.Router()
jobRouter.use(bodyParser.json())

jobRouter
  .route("/")
  .get(authenticate.verifyUser, (req, res, next) => {
    Jobs.findOne({ user: req.user._id })
      .populate("user")
      .populate("jobs")
      .then(
        jobs => {
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(jobs)
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Jobs.findOne({ user: req.user._id })
      .then(
        item => {
          if (item) {
            for (var i = 0; i < req.body.length; i++) {
              let n = req.body[i]._id
              if (item.jobs.indexOf(n) === -1) {
                item.jobs.push(n)
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
            jobs.create({ user: req.user._id, jobs: req.body }).then(
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
    res.end("PUT operation not supported on /jobs")
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    jobs.findOneAndRemove({ user: req.user._id })
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

jobRouter
  .route("/:jobId")
  .options((req, res) => {
    res.sendStatus(200)
  })
  .get(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end(req.params.jobId)
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Jobs.findOne({ user: req.user._id })
      .then(
        item => {
          if (item) {
            if (item.jobs.indexOf(req.params.jobId) === -1) {
              item.jobs.push(req.params.jobId)
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
            jobs.create({
              user: req.user._id,
              jobs: [req.params.jobId],
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
    res.end(req.params.jobId)
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Jobs.findOne({ user: req.user._id })
      .then(
        item => {
          if (item) {
            index = item.jobs.indexOf(req.params.jobId)
            if (index >= 0) {
              item.jobs.splice(index, 1)
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

module.exports = jobRouter
