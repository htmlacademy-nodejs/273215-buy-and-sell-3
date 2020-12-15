'use strict';

class SearchService {
  constructor(offer) {
    this.offer = offer;
  }
  async findAll(searchText) {
    const offers = await this.offer.findAll({
      where: Sequelize.where(
          Sequelize.fn(`lower`, Sequelize.col(`title`)),
          {
            [Op.like]: `%${searchText.toLowerCase()}%`
          }
      )
    });
    return offers;
  }
}

module.exports = SearchService;
