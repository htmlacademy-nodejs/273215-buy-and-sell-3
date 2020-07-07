'use strict';

const {
  MAX_ID_LENGTH,
} = require(`../../constants`);

const {nanoid} = require(`nanoid`);

class OfferService {
  constructor(offers) {
    this._offers = offers;
  }

  create(offer) {
    const newOffer = Object
    .assign({id: nanoid(MAX_ID_LENGTH), comments: []}, offer);

    this._offers.push(newOffer);
    return newOffer;
  }

  drop(id) {
    const offerIndex = this._offers.findIndex((item) => item.id === id);

    if (!~offerIndex) {
      return null;
    }

    return this._offers.splice(offerIndex, 1);
  }

  findAll() {
    return this._offers;
  }

  findOne(id) {
    return this._offers.find((item) => item.id === id);
  }

  update(id, offer) {
    const oldOffer = this._offers
    .find((item) => item.id === id);

    return Object.assign(oldOffer, offer);
  }

}

module.exports = OfferService;
