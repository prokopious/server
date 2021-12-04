var express = require("express")
var router = express.Router()
const bodyParser = require("body-parser")
var User = require("../models/user")

var passport = require('passport');
var authenticate = require('../authenticate');
router.use(bodyParser.json())
/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  User.find({})
  .then((data) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(data);
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post("/signup", (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500
        res.setHeader("Content-Type", "application/json")
        res.json({ err: err })
      } else {
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.json({ success: true, status: "Registration Successful!" })
        })
      }
    }
  )
})

router.post('/login', passport.authenticate('local'), (req, res) => {  
  var thing = req.user
  var token = authenticate.getToken({ _id: thing._id });
console.log("here's the token: " + token)
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  console.log("the damn id: " + req.user._id)
  res.json({success: true, token: token, status: 'Shit!'});
});
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy()
    res.clearCookie("session-id")
    res.redirect("/")
  } else {
    var err = new Error("You are not logged in!")
    err.status = 403
    next(err)
  }
})

module.exports = router
