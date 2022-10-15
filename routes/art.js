const express = require('express');
const router = express.Router();

// get all artwork
router.get('/', async function (req, res) {
  const sequelize = req.app.get('sequelize');
  try {
    const art = await sequelize.models.Artwork.findAll();
    res.json(art);
  } catch (e) {
    res.status(400);
    res.end(e.message);
  }
});

router.get('/:id', async function (req, res) {
  const sequelize = req.app.get('sequelize');
  try {
    const art = await sequelize.models.Artwork.findByPk(req.params.id);
    if (art) {
      res.json(art);
    } else {
      res.status(404).end('404 Not found');
    }
  } catch (e) {
    res.status(400).end(e.message);
  }
});

module.exports = router;
