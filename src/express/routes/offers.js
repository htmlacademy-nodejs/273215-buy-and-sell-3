'use strict';
const {Router} = require(`express`);
const offersRouter = new Router();
const {getData, sendData} = require(`../request`);

offersRouter.get(`/add`, async (req, res) => {
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

offersRouter.get(`/edit/:id`, async (req, res) => {
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
  res.render(`ticket`, offer);
});

offersRouter.post(`/add`, async (req, res) => {
  const reviewForm = req.body;
  
  const response = await sendData(`/api/offers`, {
    comments: [],
    title: reviewForm[`ticketName`],
    description: reviewForm[`comment`],
    category: Array.isArray(reviewForm[`category`]) ? reviewForm[`category`] : [reviewForm[`category`]],
    picture: reviewForm[`avatar`],
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
  console.log(`response`, response);
});

module.exports = offersRouter;
