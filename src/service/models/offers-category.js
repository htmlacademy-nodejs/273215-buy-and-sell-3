'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  const Offer = require(`./offer`)(sequelize);
  const Category = require(`./category`)(sequelize);

  class OffersCategory extends Model {}
  OffersCategory.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    offerId: {
      type: DataTypes.INTEGER,
      field: `offer_id`,
      reference: {
        model: Offer,
        key: `id`
      },
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      field: `category_id`,
      reference: {
        model: Category,
        key: `id`
      },
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
    tableName: `offers_categories`,
  });

  return OffersCategory;
};

