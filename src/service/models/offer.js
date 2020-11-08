'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  const OffersType = require(`./offers-type`)(sequelize);
  const Picture = require(`./picture`)(sequelize);
  const User = require(`./user`)(sequelize);

  class Offer extends Model {}
  Offer.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.INTEGER,
      reference: {
        model: OffersType,
        key: `id`
      },
      allowNull: false,
    },
    pictureId: {
      type: DataTypes.INTEGER,
      field: `picture_id`,
      reference: {
        model: Picture,
        key: `id`
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      field: `user_id`,
      reference: {
        model: User,
        key: `id`
      },
      allowNull: false,
    },
    sum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createDate: {
      type: DataTypes.DATE,
      field: `create_date`,
      allowNull: false,
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
    tableName: `offers`
  });

  return Offer;
};

