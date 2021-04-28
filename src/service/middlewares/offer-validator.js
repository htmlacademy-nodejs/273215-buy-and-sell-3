'use strict';

const {HttpCode} = require(`../../constants`);

const offerKeys = [`category`, `description`, `picture`, `title`, `type`, `sum`];

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keysExists = offerKeys.every((key) => {
    if (!keys.includes(key)) {
      return keys.includes(key);
    }
  });

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST)
    .send(`Bad request!!!`);
  }

  return next();
};
