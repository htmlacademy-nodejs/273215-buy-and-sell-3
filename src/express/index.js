'use strict';

const express = require(`express`);
const path = require(`path`);

const app = express();
const offersRoutes = require(`./routes/offers`);
const myRoutes = require(`./routes/my`);
const appRoutes = require(`./routes/app-router`);


const PUBLIC_DIR = `public`;
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.urlencoded({extended: false}));

app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);
app.use(`/`, appRoutes);

const port = 8080;
app.listen(port);

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);


