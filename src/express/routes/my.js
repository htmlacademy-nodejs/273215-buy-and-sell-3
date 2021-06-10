'use strict';
const {Router} = require(`express`);
const myRouter = new Router();
const {getData} = require(`../request`);
const privateRoute = require(`../middlewares/private-route`);

myRouter.get(`/`, privateRoute, async (req, res) => {
  const contentData = await getData(`/api/offers${req.url}`);
  res.render(`my-tickets`, contentData);
});
myRouter.get(`/comments`, privateRoute, async (req, res) => {
  const contentData = await getData(`/api/offers`);
  contentData.length = 3;
  res.render(`comments`, contentData);
});

module.exports = myRouter;
