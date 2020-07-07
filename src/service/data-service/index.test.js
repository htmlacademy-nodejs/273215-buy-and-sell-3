'use strict';

const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
} = require(`./`);

const testDataOffers = [
  {
    id: `CmuE9n`,
    comments: [
      {id: `6IOcOK`, text: `Вы что?! В магазине дешевле. Неплохо, но дорого. Оплата наличными или перевод на карту?`},
      {id: `K7XifS`, text: `А где блок питания?`},
      {id: `x7Cy2P`, text: `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`},
      {id: `ghobhH`, text: `Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле.`}],
    title: `цэ сгененрированный элемент для изменения`,
    category: [`второе`, `Животные`],
  },
  {
    id: `CmuE9t`,
    comments: [],
    title: `цэ сгененрированный элемент для удаления`,
    category: [`Животные`, `Бытовая техника`],
  },
  {
    title: `цэ титл`,
    category: [`Животные`, `Бытовая техника`],
  },
  {
    title: `цэ тоже титл`,
    category: [`Животные`, `Бытовая техника`],
  },
  {
    id: `CmuE9n`,
    comments: [
      {id: `6IOcOK`, text: `Вы что?! В магазине дешевле. Неплохо, но дорого. Оплата наличными или перевод на карту?`},
      {id: `K7XifS`, text: `А где блок питания?`},
      {id: `x7Cy2P`, text: `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`},
      {id: `ghobhH`, text: `Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле.`}],
    title: `цэ сгененрированный элемент после изменения`,
    category: [`второе`, `Животные`],
  },
];

const data = [];
data.push(testDataOffers[0]);
data.push(testDataOffers[1]);
const offerService = new OfferService(data);
const сategoryService = new CategoryService(data);
const searchService = new SearchService(data);
const commentService = new CommentService();

test(`init instance of OfferService:`, () => {
  const offers = offerService.findAll();
  expect(JSON.stringify(offers)).toEqual(JSON.stringify([testDataOffers[0],testDataOffers[1]]));
});

test(`add new offer 1`, () => {
  const offers = offerService.create(testDataOffers[2]);
  expect(offers).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      title: expect.any(String),
      category: expect.any(Array),
      comments: expect.any(Array),
    }),
  );

  expect(offerService.findAll().length).toEqual(3);

  let offers2 = offerService.create(testDataOffers[3]);
  expect(offers2).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      title: expect.any(String),
      category: expect.any(Array),
      comments: expect.any(Array),
    }),
  );

  expect(offerService.findAll().length).toEqual(4);
});

test(`test findOne`, () => {
  const offers = offerService.findOne(`CmuE9n`);
  expect(JSON.stringify(offers)).toEqual(JSON.stringify(testDataOffers[0]));
});

test(`test update`, () => {
  const offers = offerService.update(`CmuE9n`, {title: `цэ сгененрированный элемент после изменения`});
  expect(JSON.stringify(offers)).toEqual(JSON.stringify(testDataOffers[4]));
});

test(`test drop`, () => {
  const offers = offerService.drop(`CmuE9t`);
  expect(JSON.stringify(offers)).toEqual(JSON.stringify([testDataOffers[1]]));
  expect(offerService.findOne(`CmuE9t`)).toEqual(undefined);
});

test(`test category link to offers`, () => {
  expect(JSON.stringify(offerService)).toEqual(JSON.stringify(сategoryService));
});

test(`test categoties list`, () => {
  expect(JSON.stringify(сategoryService.findAll())).toEqual(JSON.stringify([`второе`, `Животные`, `Бытовая техника`]));
});

test(`test search `, () => {
  expect(JSON.stringify(searchService.findAll(`цэ сгененрированный элемент после изменения`))).toEqual(JSON.stringify([testDataOffers[4]]));
});

test(`test comments findAll `, () => {
  const offer = offerService.findOne(`CmuE9n`);
  expect(JSON.stringify(commentService.findAll(offer))).toEqual(JSON.stringify(testDataOffers[0].comments));
});

test(`test comments create `, () => {
  const offer = offerService.findOne(`CmuE9n`);
  const newComment = {text: `Совсем немного... А сколько игр в комплекте?`};
  const comment = commentService.create(offer, newComment);
  expect(comment).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      text: `Совсем немного... А сколько игр в комплекте?`
    }),
  );

  expect((commentService.findAll(offer)).find((item) => item.id === comment.id)).toEqual(comment);

});

test(`test comments drop `, () => {
  const offer = offerService.findOne(`CmuE9n`);
  const comment = commentService.drop(offer, `6IOcOK`);

  expect((commentService.findAll(offer)).find((item) => item.id === comment.id)).toEqual(undefined);
  expect(commentService.drop(offer, `6IOcOK`)).toEqual(null);
});
