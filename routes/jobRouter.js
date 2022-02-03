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
.get((req, res, next) => {
  Jobs.findById(req.params.jobId)
    .then(
      recruiter => {
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.json(job)
      },
      err => next(err)
    )
    .catch(err => next(err))
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403
  res.end(
    "recruiter operation not supported on /recruiters/" +
      req.params.jobId
  )
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Jobs.findOneAndUpdate(
    req.params.recruiterId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then(
      job => {
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.json(job)
      },
      err => next(err)
    )
    .catch(err => next(err))
})
.delete(
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    Jobs.findByIdAndRemove(req.params.jobId)
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

module.exports = jobRouter
