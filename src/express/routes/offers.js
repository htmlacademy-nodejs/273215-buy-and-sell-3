'use strict';
const {Router} = require(`express`);
const csrfProtection = require(`../middlewares/csrf-protection`);
const bodyParser = require(`body-parser`);
const parseForm = bodyParser.urlencoded({extended: false});

const offersRouter = new Router();
const {
  getData,
  sendData,
  putData
} = require(`../request`);
const upload = require(`../middlewares/uploader`);
const privateRoute = require(`../middlewares/private-route`);

offersRouter.get(`/add`, [csrfProtection, privateRoute], async (req, res) => {
  const allCategories = await getData(`/api/categories`);
  const categories = allCategories.map((item) => {
    return {
      item,
      selected: false,
    };
  });
  res.render(`new-ticket`, {reviewForm: {}, categories});
});

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));

offersRouter.get(`/edit/:id`, [csrfProtection, privateRoute], async (req, res) => {
  const offer = await getData(`/api/offers/${req.params.id}`);
  const allCategories = await getData(`/api/categories`);
  const categories = allCategories.map((item) => {
    return {
      item,
      selected: offer.category.includes(item),
    };
  });
  res.render(`ticket-edit`, {offer, categories});
});

offersRouter.get(`/:id`, async (req, res) => {
  const offer = await getData(`/api/offers/${req.params.id}`);
  if (offer) {
    res.render(`ticket`, offer);
  } else {
    res.render(`errors/404`, offer);
  }
});

offersRouter.post(`/add`, [
  parseForm,
  csrfProtection,
  privateRoute,
  upload.single(`avatar`)
], async (req, res) => {
  const reviewForm = req.body;
  const {file} = req;
  const response = await sendData(`/api/offers`, {
    comments: [],
    title: reviewForm[`ticketName`],
    description: reviewForm[`comment`],
    category: Array.isArray(reviewForm[`category`]) ? reviewForm[`category`] : [reviewForm[`category`]],
    picture: file.filename,
    type: reviewForm[`action`] === `sell` ? `sale` : `offer`,
    sum: +reviewForm[`price`],
  });

  if (response) {
    res.redirect(`/my`);
  } else {
    const allCategories = await getData(`/api/categories`);
    const categories = allCategories.map((item) => {
      return {
        item,
        selected: reviewForm[`category`].includes(item),
      };
    });
    res.render(`new-ticket`, {reviewForm, categories});
  }
});

offersRouter.post(`/edit/:id`, [
  parseForm,
  csrfProtection,
  privateRoute,
  upload.single(`avatar`)
], async (req, res) => {
  const reviewForm = req.body;
  const {file} = req;
  const offer = {
    comments: [],
    title: reviewForm[`ticketName`],
    description: reviewForm[`comment`],
    category: Array.isArray(reviewForm[`category`]) ? reviewForm[`category`] : [reviewForm[`category`]],
    type: reviewForm[`action`] === `sell` ? `sale` : `offer`,
    sum: +reviewForm[`price`],
  };
  const response = await putData(
      `/api/offers/:id`,
      Object.assign(offer, file ? {picture: file} : {})
  );

  if (response) {
    res.redirect(`/my`);
  } else {
    const allCategories = await getData(`/api/categories`);
    const categories = allCategories.map((item) => {
      return {
        item,
        selected: reviewForm[`category`].includes(item),
      };
    });
    res.render(`new-ticket`, {reviewForm, categories});
  }
});
module.exports = offersRouter;
