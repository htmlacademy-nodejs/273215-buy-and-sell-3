'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string()
  .min(10)
  .max(100)
  .required(),

  description: Joi.string()
  .min(50)
  .max(1000)
  .required(),

  sum: Joi.number()
  .min(100)
  .required(),

  comments: Joi.array(),

  category: Joi.array().items(Joi.string()),

  picture: Joi.string(),

  type: Joi.string()
  .valid(`offer`, `sale`)
  .required(),
});
