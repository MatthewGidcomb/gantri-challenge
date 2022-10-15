const express = require('express');
const router = express.Router();

// get all users
router.get('/', async function (req, res, next) {
  const sequelize = req.app.get('sequelize');
  try {
    const users = await sequelize.models.User.findAll();
    res.json(users);
  } catch (e) {
    res.status(400).end(e.message);
  }
});

// create a new user
router.post('/', async function (req, res, next) {
  const { name, age, location } = req.body;
  const sequelize = req.app.get('sequelize');

  // TODO: better validation (maybe Joi, although might be overkill)
  if (!name || !age || !location) {
    return res.status(422).end('Missing required field');
  }

  if (typeof age !== 'number' || age <= 0) {
    return res.status(422).end('Invalid age');
  }

  try {
    await sequelize.models.User.create({ name, age, location });
    // normally I'd want to use 201 w/ location header, but spec doesn't
    // include a GET endpoint for individual users
    res.status(204).end();
  } catch (e) {
    res.status(422).end(e);
  }
});

module.exports = router;
