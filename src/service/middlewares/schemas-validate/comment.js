'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  text: Joi.string()
  .min(10)
  .max(1000)
  .required(),
});
