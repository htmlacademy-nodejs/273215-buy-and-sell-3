'use strict';

const express = require(`express`);
const path = require(`path`);
const {getData} = require(`./request`);

const app = express();
const offersRoutes = require(`./routes/offers`);
const myRoutes = require(`./routes/my`);


const PUBLIC_DIR = `public`;
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.urlencoded({extended: false}));

app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

const port = 8080;
app.listen(port);

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.get(`/`, async (req, res) => {
  /*  получение данных */
  const contentNews = await getData(`/api/offers`);
  const contentMostTalked = await getData(`/api/offers`);
  contentMostTalked.length = 4;
  res.render(`main`, {offers: contentNews, mostTalked: contentMostTalked});
});

app.get(`/register`, (req, res) => res.render(`sign-up`));
app.get(`/login`, (req, res) => res.render(`login`));
app.get(`/search`, async (req, res) => {
  const searchResult = await getData(`/api${req.url}`);
  const ticketsList = {};
  res.render(`search-result`, {searchResult, ticketsList});
});
