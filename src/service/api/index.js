'use strict';

const {Router} = require(`express`);

const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
} = require(`../data-service/`);


const offer = require(`./offer`);
const search = require(`./search`);
const category = require(`./category`);

const initRouter = async () => {
  const app = new Router();
  const offerService = new OfferService();

  category(app, new CategoryService());
  search(app, new SearchService(offerService));
  offer(app, offerService, new CommentService());

  return app;
};

module.exports = initRouter;
