'use strict';

const {Router} = require(`express`);

const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
  UserService,
} = require(`../data-service/`);


const offer = require(`./offer`);
const search = require(`./search`);
const category = require(`./category`);
const user = require(`./user`);

const initRouter = async () => {
  const app = new Router();
  const offerService = new OfferService();

  category(app, new CategoryService());
  search(app, new SearchService(offerService));
  offer(app, offerService, new CommentService());
  user(app, new UserService());

  return app;
};

module.exports = initRouter;
