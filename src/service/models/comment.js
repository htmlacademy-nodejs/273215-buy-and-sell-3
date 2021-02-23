'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  const Offer = require(`./offer`)(sequelize);
  const User = require(`./user`)(sequelize);

  class Comment extends Model {}
  Comment.init({
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created: {
      type: DataTypes.DATE,
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
    userId: {
      type: DataTypes.INTEGER,
      field: `user_id`,
      reference: {
        model: User,
        key: `id`
      },
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
    tableName: `comments`,
  });

  return Comment;
};

