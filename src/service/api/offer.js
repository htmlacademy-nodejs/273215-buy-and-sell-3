'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const schemas = require(`../middlewares/schemas-validate`);
const offerValidator = require(`../middlewares/schemas-validator`)(schemas.offer);
const commentValidator = require(`../middlewares/schemas-validator`)(schemas.comment);
const offerExist = require(`../middlewares/offer-exist`);
const paramValidator = require(`../middlewares/param-validator`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();
  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const page = +req.query.page;
    const limit = +req.query.limit;
    const data = await offerService.findAll({page, limit});
    res.status(HttpCode.OK).json(data);
  });

  route.get(`/:offerId`, paramValidator(`offerId`), async (req, res) => {

    const {offerId} = req.params;
    const offer = await offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK)
    .json(offer);
  });

  route.post(`/`, offerValidator, async (req, res) => {
    const offer = await offerService.create(req.body);

    return res.status(HttpCode.CREATED)
    .json(offer);
  });
  route.put(`/:offerId`, [paramValidator(`offerId`), offerValidator], async (req, res) => {
    const {offerId} = req.params;
    const updatedOffer = await offerService.update(offerId, req.body);

    if (!updatedOffer) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK)
    .json(updatedOffer);
  });

  route.delete(`/:offerId`, paramValidator(`offerId`), async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.drop(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found`);
    }

    return res.status(HttpCode.OK)
    .json(offer);
  });

  route.get(`/:offerId/comments`, [paramValidator(`offerId`), offerExist(offerService)], async (req, res) => {
    const {offerId} = req.params;
    const comments = await commentService.findAll(offerId);

    res.status(HttpCode.OK)
    .json(comments);

  });

  route.delete(`/:offerId/comments/:commentId`, [paramValidator(`offerId`), paramValidator(`commentId`), offerExist(offerService)], async (req, res) => {
    const {commentId} = req.params;
    const deletedComment = await commentService.drop(commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found`);
    }

    return res.status(HttpCode.OK)
    .json(deletedComment);
  });

  route.post(`/:offerId/comments`, [paramValidator(`offerId`), offerExist(offerService), commentValidator], async (req, res) => {
    const {offerId} = req.params;
    const comment = await commentService.create(offerId, req.body);

    return res.status(HttpCode.CREATED)
    .json(comment);
  });
};
