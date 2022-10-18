const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().max(255).required(),
  age: Joi.number().integer().min(1).required(),
  location: Joi.string().max(255).required()
});

module.exports = userSchema;
