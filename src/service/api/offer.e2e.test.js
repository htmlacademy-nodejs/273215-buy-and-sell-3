'use strict';

const request = require(`supertest`);
const serverApi = require(`../cli/server`);

const {HttpCode} = require(`../../constants`);

let server;
let offerAsMock;

const newOffer = {
  comments: [],
  title: `цэ новый элемент`,
  description: `Если найдёте дешевле — сброшу цену. Налетай! Торопись! Покупай живопись! Продаю с болью в сердце... Товар в отличном состоянии.`,
  category: [`Разное`],
  picture: `test.png`,
  type: `offer`,
  sum: 22222
};

const incorrectNewOffer = {
  comments: [],
  title: `цэ новый элемент`,
  catalog: [`второе`],
};

const addNewOffer = async function() {
  const res = await request(server)
  .post(`/api/offers/`)
  .send(newOffer);
  return JSON.parse(res.res.text);
};

beforeAll(async () => {
  server = await serverApi.initServer();
});

describe(`Offers API end-to-end tests`, () => {
  test(`When get offers status code should be 200`, async () => {

    const res = await request(server)
    .get(`/api/offers`);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`When get offer by ID, status code should be 200`, async () => {
    const offerId = 1;
    const res = await request(server)
    .get(`/api/offers/${offerId}`);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`When get offerID is not exists, status code should be 404`, async () => {
    const offerId = `30000000009`;
    const res = await request(server).get(`/api/offers/${offerId}`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`When add new offer, status code should be 201`, async () => {
    const res = await request(server)
    .post(`/api/offers/`)
    .send(newOffer);

    expect(res.statusCode).toBe(HttpCode.CREATED);
    expect(res.body).toHaveProperty(`id`);
    expect(res.body).toHaveProperty(`title`);
  });

  test(`When add incorrect offer, status code should be 400`, async () => {
    const res = await request(server)
    .post(`/api/offers/`)
    .send(incorrectNewOffer);

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`When update offer, status code should be 200`, async () => {
    const result = await request(server)
    .post(`/api/offers/`)
    .send(newOffer);
    const offer = JSON.parse(result.res.text);
    const updatedOffer = {
      title: `цэ измененый элемент`,
      description: offer.description,
      type: `offer`,
      sum: 55555};
    const res = await request(server)
    .put(`/api/offers/${offer.id}`)
    .send(updatedOffer);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`When delete offer, status code should be 200`, async () => {
    const result = await request(server)
    .post(`/api/offers/`)
    .send(newOffer);

    const offerId = JSON.parse(result.res.text).id;
    const res = await request(server)
    .delete(`/api/offers/${offerId}`);

    expect(res.statusCode).toBe(HttpCode.OK);

    const getDeletedOffer = await request(server).get(`/api/offers/${offerId}`);

    expect(getDeletedOffer.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`When delete not exists offerID, status code should be 404`, async () => {
    const offerId = `3099`;
    const res = await request(server)
    .del(`/api/offers/${offerId}`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  describe(`Test offer's comments`, () => {

    beforeEach(async () => {
      server = await serverApi.initServer();
      offerAsMock = await addNewOffer();
    });

    test(`When get offer's comments, status code should be 200`, async () => {
      const offerId = offerAsMock.id;
      const res = await request(server).get(`/api/offers/${offerId}/comments`);

      expect(res.statusCode).toBe(HttpCode.OK);
    });

    test(`When get comments by incorrect offerID, status code should be 404`, async () => {
      const offerId = offerAsMock.id + 100;
      const res = await request(server).get(`/api/offers/${offerId}/comments`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`When add new offer's comments, status code should be 200`, async () => {
      const offerId = offerAsMock.id;
      const commentData = {text: `Новый комментарий`};
      const res = await request(server).post(`/api/offers/${offerId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.CREATED);
    });

    test(`When add incorrect new offer's comments, status code should be 400`, async () => {
      const offerId = offerAsMock.id;
      const commentData = {comment: `Новый комментарий`};
      const res = await request(server).post(`/api/offers/${offerId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`When add comment by incorrect offerID, status code should be 404`, async () => {
      const offerId = offerAsMock.id + 1;
      const commentData = {text: `Новый комментарий`};
      const res = await request(server).post(`/api/offers/${offerId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`When delete offer's comment, status code should be 200`, async () => {
      const offerId = offerAsMock.id;
      const commentData = {text: `Новый комментарий`};
      await request(server).post(`/api/offers/${offerId}/comments`).send(commentData);
      const commentsAsMosk = await request(server).get(`/api/offers/${offerAsMock.id}/comments`);

      const commentId = JSON.parse(commentsAsMosk.res.text)[0].id;
      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.OK);

      const comments = await request(server).get(`/api/offers/${offerId}/comments`);
      expect(comments.body.some(comm => comm.id === commentId)).toBe(false);
    });

    test(`When delete offer's comment by nonexistent comment's ID, status code should be 404`, async () => {
      const offerId = offerAsMock.id;
      const commentId = `123`;
      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`When delete offer's comment by incorrect comment's ID, status code should be 400`, async () => {
      const offerId = offerAsMock.id;
      const commentId = `noExistId`;
      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`When delete offer's comment with nonexistent offer ID, status code should be 404`, async () => {
      const offerId = offerAsMock.id + 100;

      const commentId = `23`;
      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

