'use strict';
const {Router} = require(`express`);
const myRouter = new Router();
const {getData} = require(`../request`);

myRouter.get(`/`, async (req, res) => {
  const contentData = await getData(`/api/offers${req.url}`);
  res.render(`my-tickets`, contentData);
});
myRouter.get(`/comments`, async (req, res) => {
  const contentData = await getData(`/api/offers`);
  contentData.length = 3;
  res.render(`comments`, contentData);
});

module.exports = myRouter;
