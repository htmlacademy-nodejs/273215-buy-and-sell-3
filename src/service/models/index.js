'use strict';
const {sequelize} = require(`../db-connect`);

const model = () => {
  const Category = require(`./category`)(sequelize);
  const Comment = require(`./comment`)(sequelize);
  const Offer = require(`./offer`)(sequelize);
  const OffersType = require(`./offers-type`)(sequelize);
  const Picture = require(`./picture`)(sequelize);
  const User = require(`./user`)(sequelize);

  Offer.belongsTo(User, {
    foreignKey: `user_id`,
    as: `user`
  });

  User.hasMany(Offer, {
    foreignKey: `user_id`,
    as: `user`
  });

  Offer.belongsToMany(Category, {
    through: `offers_categories`,
    as: `categories`,
    foreignKey: `offer_id`,
    timestamps: false,
    onDelete: `CASCADE`,
  });

  Category.belongsToMany(Offer, {
    through: `offers_categories`,
    as: `offers`,
    foreignKey: `category_id`,
    timestamps: false,
    onDelete: `CASCADE`,
  });

  Offer.belongsTo(Picture, {
    foreignKey: `picture_id`,
    as: `picture`
  });

  Picture.hasMany(Offer, {
    foreignKey: `picture_id`,
    as: `picture`
  });

  Comment.belongsTo(Offer, {
    foreignKey: `id`,
    as: `comments`
  });

  Offer.hasMany(Comment, {
    foreignKey: `offer_id`,
    as: `comments`
  });

  Comment.belongsTo(User, {
    foreignKey: `id`,
    as: `comment_user`
  });

  User.hasMany(Comment, {
    foreignKey: `user_id`,
    as: `comment_user`
  });

  Offer.belongsTo(OffersType, {
    foreignKey: `type`,
    as: `offer_type`
  });

  return {
    Category,
    Comment,
    Offer,
    OffersType,
    Picture,
    User,
  };
};

module.exports = model();
