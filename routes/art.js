const express = require('express');
const router = express.Router();

const ArtworkDTO = require('../dto/artwork');

// get all artwork
router.get('/', async function (req, res) {
  const sequelize = req.app.get('sequelize');
  try {
    const art = await sequelize.models.Artwork.findAll({
      include: [
        { model: sequelize.models.Comment, include: sequelize.models.User }
      ]
    });
    res.json(art.map((model) => ArtworkDTO.fromModel(model)));
  } catch (e) {
    res.status(400);
    res.end(e.message);
  }
});

router.get('/:id(\\d+)', async function (req, res) {
  const sequelize = req.app.get('sequelize');
  try {
    const art = await sequelize.models.Artwork.findByPk(req.params.id, {
      include: [
        { model: sequelize.models.Comment, include: sequelize.models.User }
      ]
    });
    if (art) {
      res.json(ArtworkDTO.fromModel(art));
    } else {
      res.status(404).end('404 Not found');
    }
  } catch (e) {
    res.status(400).end(e.message);
  }
});

// create a new comment
router.post('/:id(\\d+)/comments', async function (req, res) {
  const { content, name, userID: userId } = req.body;
  const sequelize = req.app.get('sequelize');

  const artwork = await sequelize.models.Artwork.findByPk(req.params.id);

  if (!artwork) {
    return res.status(404).end(`artwork ${req.params.id} not found`);
  }

  // simple case: content and userID
  // but... what should happen with a name + userID specified?
  if (typeof content === 'string' && content.length > 0 && typeof userId === 'number') {
    try {
      await artwork.createComment({ content, userId, name: null });
    } catch (e) {
      res.status(422).end(e.message);
    }
    return res.status(204).end();
  } else if (typeof content === 'string' && content.length > 0 && typeof name === 'string') {
    // alternate case, we'll call this a "guest" user
    try {
      await artwork.createComment({ content, name, userId: null });
    } catch (e) {
      res.status(422).end(e.message);
    }
    return res.status(204).end();
  } else {
    return res.status(422).end('invalid body');
  }
});

module.exports = router;
