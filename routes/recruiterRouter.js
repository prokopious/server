const express = require("express")
const bodyParser = require("body-parser")
var authenticate = require("../authenticate")

const Recruiters = require("../models/recruiters")

const recruiterRouter = express.Router()

recruiterRouter.use(bodyParser.json())

recruiterRouter
  .route("/")
  .get((req, res, next) => {
    Recruiters.find({})
      .then(
        recruiters => {
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(recruiters)
        },
        err => next(err)
      )
      .catch(err => next(err))
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Recruiters.create(req.body)
      .then(
        recruiter => {
          console.log("recruiter Created ", recruiter)
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json(recruiter)
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
    res.end("PUT operation not supported on /recruiters")
  })
recruiterRouter
.route("/:recruiterId")
.get((req, res, next) => {
  Recruiters.findById(req.params.recruiterId)
      .then((recruiter) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(recruiter);
      }, (err) => next(err))
      .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(authenticate.verifyUser, (req, res, next) => {
  Recruiters.findByIdAndUpdate(req.params.recruiterId, {
      $set: req.body
  }, { new: true })
  .then((recruiter) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(recruiter);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
  Recruiters.findByIdAndRemove(req.params.recruiterId)
  .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});

module.exports = recruiterRouter
