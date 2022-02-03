const express = require("express")
const bodyParser = require("body-parser")
const Jobs = require("../models/jobs")
var authenticate = require("../authenticate")
const jobRouter = express.Router()
jobRouter.use(bodyParser.json())

jobRouter
.route("/")
.get((req, res, next) => {
  Jobs.find({})
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
  Jobs.create(req.body)
    .then(
      job => {
        console.log("post Created ", job)
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.json(job)
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
    res.end("PUT operation not supported on /jobs")
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Jobs.findOneAndRemove({ user: req.user._id })
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
  .get((req, res, next) => {
    Jobs.findById(req.params.jobId)
    .then((job) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(job);
    }, (err) => next(err))
    .catch((err) => next(err));
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
            Jobs.create({
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
