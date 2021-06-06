'use strict';

const express = require(`express`);
const helmet = require(`helmet`);
const expressSession = require(`express-session`);
const path = require(`path`);
const cookieParser = require(`cookie-parser`);

const app = express();
const offersRoutes = require(`./routes/offers`);
const myRoutes = require(`./routes/my`);
const appRoutes = require(`./routes/app-router`);


const PUBLIC_DIR = `public`;
app.use(cookieParser());
app.use(helmet());
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.urlencoded({extended: false}));

const PORT = 8080;
const SECRET = `secret42`;
app.use(expressSession({
  secret: SECRET,
  resave: false,
  saveUninitialized: false,
  name: `session_id`,
  cookie: {secure: false},
}));

app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);
app.use(`/`, appRoutes);

app.listen(PORT);

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);
