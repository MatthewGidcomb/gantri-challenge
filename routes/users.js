const express = require('express');
const router = express.Router();
const debug = require('debug')('gantri-challenge:app:user');

const UserDTO = require('../dto/user');
const UserSchema = require('../dto/user.schema');
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

  const { error, value: body } = UserSchema.validate(req.body);

  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    debug(`error(s) parsing body: ${messages}`);
    return res.status(422).json({ message: `invalid request: ${messages}` });
  } else {
    try {
      const newUser = await sequelize.models.User.create(body);
      return res.status(201).json(UserDTO.fromModel(newUser));
    } catch (e) {
      return res.status(422).end(e.message);
    }
  }
});

module.exports = router;
