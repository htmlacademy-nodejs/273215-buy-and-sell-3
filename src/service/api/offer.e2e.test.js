'use strict';

const request = require(`supertest`);
const serverApi = require(`../cli/server`);

const getMockData = require(`../lib/get-mock-data`);
const {HttpCode} = require(`../../constants`);

let server;
let mockData;

const newOffer = {
  comments: [],
  title: `цэ новый элемент`,
  description: `Если найдёте дешевле — сброшу цену. Налетай! Торопись! Покупай живопись! Продаю с болью в сердце... Товар в отличном состоянии.`,
  category: [`второе`],
  picture: `test.png`,
  type: `offer`,
  sum: 22222
};

const incorrectNewOffer = {
  comments: [],
  title: `цэ новый элемент`,
  catalog: [`второе`],
};

beforeAll(async () => {
  server = await serverApi.initServer();
  mockData = await getMockData();
});

describe(`Offers API end-to-end tests`, () => {
  test(`When get offers status code should be 200`, async () => {

    const res = await request(server)
    .get(`/api/offers`);

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body).toStrictEqual(mockData);
  });

  test(`When get offer by ID, status code should be 200`, async () => {
    const offerId = mockData[0].id;
    const res = await request(server)
    .get(`/api/offers/${offerId}`);

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body).toStrictEqual(mockData[0]);
  });

  test(`When get offerID is not exists, status code should be 404`, async () => {
    const offerId = `noExistID`;
    const res = await request(server).get(`/api/offers/${offerId}`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`When add new offer, status code should be 200`, async () => {
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
    const updatedOffer = {...mockData[0], title: `цэ измененый элемент`, sum: 55555};
    const res = await request(server)
    .put(`/api/offers/${mockData[0].id}`)
    .send(updatedOffer);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`When delete offer, status code should be 200`, async () => {
    const offerId = mockData[0].id;
    const res = await request(server)
    .del(`/api/offers/${offerId}`);

    expect(res.statusCode).toBe(HttpCode.OK);

    const getDeletedOffer = await request(server).get(`/api/offers/${offerId}`);

    expect(getDeletedOffer.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`When delete not exists offerID, status code should be 404`, async () => {
    const offerId = `noExistId`;
    const res = await request(server)
    .del(`/api/offers/${offerId}`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  describe(`Test offer's comments`, () => {
    test(`When get offer's comments, status code should be 200`, async () => {
      const offerId = mockData[0].id;
      const res = await request(server).get(`/api/offers/${offerId}/comments`);

      expect(res.statusCode).toBe(HttpCode.OK);
      expect(res.body).toStrictEqual(mockData[0].comments);
    });

    test(`When get comments by incorrect offerID, status code should be 404`, async () => {
      const offerId = `noExistId`;
      const res = await request(server).get(`/api/offers/${offerId}/comments`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`When add new offer's comments, status code should be 200`, async () => {
      const offerId = mockData[0].id;
      const commentData = {text: `Новый комментарий`};
      const res = await request(server).post(`/api/offers/${offerId}/comments`).send(commentData);
      const returnedComment = {...commentData, id: res.body.id};

      expect(res.statusCode).toBe(HttpCode.CREATED);
      expect(res.body).toStrictEqual(returnedComment);
    });

    test(`When add incorrect new offer's comments, status code should be 400`, async () => {
      const offerId = mockData[0].id;
      const commentData = {comment: `Новый комментарий`};
      const res = await request(server).post(`/api/offers/${offerId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`When add comment by incorrect offerID, status code should be 404`, async () => {
      const offerId = `noExistId`;
      const commentData = {text: `Новый комментарий`};
      const res = await request(server).post(`/api/offers/${offerId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`When delete offer's comment, status code should be 200`, async () => {
      const offerId = mockData[0].id;
      const comment = mockData[0].comments[0];
      const commentId = comment.id;
      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.OK);
      expect(res.body).toStrictEqual(comment);

      const comments = await request(server).get(`/api/offers/${offerId}/comments`);
      expect(comments.body.some(comm => comm.id === commentId)).toBe(false);
    });

    test(`When delete offer's comment by incorrect comment's ID, status code should be 404`, async () => {
      const offerId = mockData[0].id;
      const commentId = `noExistId`;
      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`When delete offer's comment with incorrect offer ID, status code should be 404`, async () => {
      const offerId = `noExistId`;
      const commentId = mockData[0].comments[0].id;
      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`Delete offer's comment when comment ID not link offer ID, status code should be 404`, async () => {
      const offerId = mockData[0].id;
      const comment = mockData[1].comments[0];
      const commentId = comment.id;
      const res = await request(server).delete(`/api/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

