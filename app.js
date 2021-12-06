var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cors = require("cors")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
var session = require("express-session")
var FileStore = require("session-file-store")(session)
var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")
var promoRouter = require("./routes/promoRouter")
var leaderRouter = require("./routes/leaderRouter")
const favoriteRouter = require("./routes/favoriteRouter")
var postRouter = require("./routes/dishRouter")
var passport = require("passport")
var authenticate = require("./authenticate")
const mongoose = require("mongoose")
const Posts = require("./models/posts")

var config = require("./config")
const url = config.mongoUrl

const connect = mongoose.connect(url)
connect.then(
  db => {
    console.log("connected to the server")
  },
  err => {
    console.log(err)
  }
)

var app = express()

app.all("*", (req, res, next) => {
  if (req.secure) {
    return next()
  } else {
    res.redirect(
      307,
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    )
  }
})

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")
app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize())

app.use("/", indexRouter)
app.use("/users", usersRouter)

app.use(express.static(path.join(__dirname, "public")))

app.use("/posts", postRouter)
app.use("/leaders", leaderRouter)
app.use("/favorites", favoriteRouter)
app.use("/promotions", promoRouter)

app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
