var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var ParseServer = require("parse-server").ParseServer;
var ParseDashboard = require("parse-dashboard");
var SimpleSendGridAdapter = require("parse-server-sendgrid-adapter");

var app = express();

var api = new ParseServer({
  databaseURI: "mongodb://127.0.0.1:27017/test",
  cloud: __dirname + "/cloud/main.js",
  appId: "test",
  appName: "test",
  masterKey: "myMasterKey",
  fileKey: "optionalFileKey",
  // verifyUserEmails: true,
  // preventLoginWithUnverifiedEmail: false,
  publicServerURL: "http://localhost:3030/parse",
  serverURL: "http://localhost:3030/parse",
  fileUpload: {
    enableForAnonymousUser: true,
  },
});

var corsOptions = {
  // origin: "https://web.bahikhata.org",
  // optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
var options = { allowInsecureHTTP: false };
var dashboard = new ParseDashboard(
  {
    apps: [
      {
        serverURL: "http://localhost:3030/parse",
        appId: "test",
        masterKey: "myMasterKey",
        appName: "test",
      },
    ],
    users: [
      {
        user: "admin",
        pass: "db@123!",
      },
    ],
    useEncryptedPasswords: false,
  },
  options
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
//corsOptions

app.use("/parse", api);
app.use("/dashboard", dashboard);

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
