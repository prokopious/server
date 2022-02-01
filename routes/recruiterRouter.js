const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
var authenticate = require('../authenticate');
const Recruiters = require("../models/recruiters")

const recruiterRouter = express.Router()

recruiterRouter.use(bodyParser.json())

recruiterRouter
  .route("/")
  .get((req, res, next) => {
    Recruiters.find({})
      .then(
        recruiters
         => {
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(recruiters
            )
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    recruiters
    .create(req.body)
      .then(
        recruiter => {
          console.log("recruiter Created ", recruiter)
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(recruiter)
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403
    res.end("PUT operation not supported on /recruiters")
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    recruiters
    .remove({})
      .then(
        resp => {
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(resp)
        },
        err => next(err)
      )
      .catch(err => next(err))
  })

recruiterRouter
  .route("/:recruiterId")
  .get((req, res, next) => {
    recruiters
    .findById(req.params.recruiterId)
      .then(
        recruiter => {
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(recruiter)
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403
    res.end("POST operation not supported on /recruiters/" + req.params.recruiterId)})
  .put(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    recruiters
    .findByIdAndUpdate(
      req.params.recruiterId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        recruiter => {
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(recruiter)
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    recruiters
    .findByIdAndRemove(req.params.recruiterId)
      .then(
        resp => {
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(resp)
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
module.exports = recruiterRouter