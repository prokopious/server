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

jobRouter
.route("/:jobId")
.post(authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(authenticate.verifyUser, (req, res, next) => {
  Jobs.findByIdAndUpdate(req.params.jobId, {
      $set: req.body
  }, { new: true })
  .then((job) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(job);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
  Jobs.findByIdAndRemove(req.params.jobId)
  .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});

module.exports = jobRouter
