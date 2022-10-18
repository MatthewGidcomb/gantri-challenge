const express = require('express');
const router = express.Router();
const debug = require('debug')('gantri-challenge:app:user');
const Joi = require('joi');

const UserDTO = require('../dto/user');

const userSchema = Joi.object({
  name: Joi.string().max(255).required(),
  age: Joi.number().integer().min(1).required(),
  location: Joi.string().max(255).required()
});

/**
 * Get all users
 */
router.get('/', async function (req, res, next) {
  const sequelize = req.app.get('sequelize');
  try {
    const users = await sequelize.models.User.findAll();
    res.json(users.map((model) => UserDTO.fromModel(model)));
  } catch (e) {
    debug(`Error fetching users: ${e.message}`);
    res.status(500).end({ message: 'An unknown error occurred' });
  }
});

/**
 * Create user
 * Body:
 * { "name": "string" "age": int, "location": "string" }
 */
router.post('/', async function (req, res, next) {
  const sequelize = req.app.get('sequelize');

  const { error, value: body } = userSchema.validate(req.body);

  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    debug(`error(s) parsing body: ${messages}`);
    return res.status(422).json({ message: `invalid request: ${messages}` });
  } else {
    try {
      await sequelize.models.User.create(body);
      // normally we'd want to use 201, but there isn't an endpoint for
      // retrieving the individual user
      return res.status(204).end();
    } catch (e) {
      return res.status(422).end(e.message);
    }
  }
});

module.exports = router;
