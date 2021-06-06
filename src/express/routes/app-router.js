'use strict';
const {Router} = require(`express`);
const appRouter = new Router();

const {getData, sendData} = require(`../request`);
const upload = require(`../middlewares/uploader`);
const privateRoute = require(`../middlewares/private-route`);
const authenticate = require(`../middlewares/authenticate`);
const csrfProtection = require(`../middlewares/csrf-protection`);
const bodyParser = require(`body-parser`);
const parseForm = bodyParser.urlencoded({extended: false});

appRouter.get(`/`, async (req, res) => {
  /*  получение данных */
  const {isLogged, avatar} = req.session;
  res.locals.isLogged = isLogged;
  res.locals.avatar = avatar;
  const contentNews = await getData(`/api/offers${req.url}`);
  const {offers: contentMostTalked} = await getData(`/api/offers/?limit=4`);
  res.render(`main`, {
    ...contentNews,
    mostTalked: contentMostTalked,
  });
});

appRouter.get(`/register`, (req, res) => res.render(`sign-up`, {errors: {}}));
appRouter.post(`/register`, [upload.single(`avatar`)], async (req, res) => {
  const reviewForm = req.body;
  const {file} = req;
  const username = reviewForm[`user-name`].match(/^(?<name>[а-яА-ЯёЁa-zA-Z-]+).(?<surname>.*)$/) || {};
  const {name, surname} = username.groups;
  const response = await sendData(`/api/user`, {
    name,
    surname,
    email: reviewForm[`user-email`],
    password: reviewForm[`user-password`],
    repeat: reviewForm[`user-password-again`],
    avatar: file ? file.filename : null,
  });

  if (response.statusCode === 400) {
    const errors = response.error.message || {};
    res.render(`sign-up`, {errors});
  } else {
    res.render(`login`);
  }
});

// todo  тесты
appRouter.get(`/login`, csrfProtection, (req, res) => res.render(`login`));
appRouter.post(`/login`, [
  parseForm,
  csrfProtection,
  authenticate,
  privateRoute
], async (req, res) => {
  res.redirect(`/`);
});

appRouter.get(`/logout`, async (req, res) => {
  req.session.destroy(() => {
    res.redirect(`/login`);
  });
});

appRouter.get(`/search`, async (req, res) => {
  const searchResult = await getData(`/api${req.url}`);
  const ticketsList = {};
  res.render(`search-result`, {...searchResult, ticketsList});
});

module.exports = appRouter;
