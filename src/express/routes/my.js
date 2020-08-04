'use strict';
const {Router} = require(`express`);
const myRouter = new Router();
const {getData} = require(`../request`);

myRouter.get(`/`, async (req, res) => {
  const contentData = await getData(`/api/offers`);
  res.render(`my-tickets`, {offers: contentData});
});
myRouter.get(`/comments`, async (req, res) => {
  const contentData = await getData(`/api/offers`);
  contentData.length = 3;
  res.render(`comments`, {offers: contentData});
});

module.exports = myRouter;
