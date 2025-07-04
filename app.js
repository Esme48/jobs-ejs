const express = require("express");
require("express-async-errors");
require("dotenv").config(); // to load the .env file into the process.env object

const csrf = require('host-csrf');
const cookieParser = require("cookie-parser");

const app = express();
const session = require("express-session");

app.set("view engine", "ejs");
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(require("body-parser").urlencoded({ extended: false }));

let csrf_development_mode = true;
if (app.get("env") === "production"){
  csrf_development_mode = false;
  app.set("trust proxy", 1);
}

const csrf_options = {
  protected_operations: ["PATCH", "POST"],
  protected_content_types: ["application/json"],
  development_mode: csrf_development_mode,
};

const MongoDBStore = require("connect-mongodb-session")(session);
//const url = process.env.MONGO_URI;
let mongoURL = process.env.MONGO_URI;
if (process.env.NODE_ENV === "test") {
  mongoURL = process.env.MONGO_URI_TEST;
}

const store = new MongoDBStore({
  // may throw an error, which won't be caught
  uri: url,
  collection: "mySessions",
});

store.on("error", function (error) {
  console.log(error);
});

const sessionParams = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); 
  sessionParams.cookie.secure = true; 
}

app.use(session(sessionParams));

const passport = require("passport");
const passportInit = require("./passport/passportInit");

passportInit();
app.use(passport.initialize());
app.use(passport.session());

app.use(require("connect-flash")());

const csrf_middleware = csrf(csrf_options);
app.use(csrf_middleware);

app.use((req, res, next) => {
  res.locals.csrfToken = csrf.token(req, res);
  next();
});

app.get("/get_token", (req, res) =>{
  csrf.refresh(req, res);
  const csrfToken = csrf.token(req, res);
  res.json({ csrfToken});
});


app.use(require("./middleware/storeLocals"));
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));

const auth = require("./middleware/auth");
const secretWordRouter = require("./routes/secretWord");
 
app.use("/secretWord", auth, secretWordRouter);
app.use("/secretWord", secretWordRouter);

const jobs = require("./routes/jobs");
app.use("/jobs", auth, jobs);

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await require("./db/connect")(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();