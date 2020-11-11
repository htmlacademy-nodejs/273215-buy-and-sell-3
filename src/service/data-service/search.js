'use strict';

class SearchService {
  constructor(offer) {
    this.offer = offer;
  }
  async findAll(searchText) {
    const offers = await this.offer.findAll({
      where: {
        title: {
          [Op.like]: `%${searchText}%`,
        }
      }
    });
    return offers;
  }

}

module.exports = SearchService;
