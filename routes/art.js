const express = require('express');
const router = express.Router();
const debug = require('debug')('gantri-challenge:app:art');
const { ForeignKeyConstraintError, UniqueConstraintError } = require('sequelize');

const ArtworkDTO = require('../dto/artwork');
const CommentDTO = require('../dto/comment');
const CommentSchema = require('../dto/comment.schema');

/**
 * Get all artworks
 * Includes comments, ordered by creation
 */
router.get('/', async function (req, res) {
  const sequelize = req.app.get('sequelize');
  try {
    const art = await sequelize.models.Artwork.findAll({
      include: [
        { model: sequelize.models.Comment, include: sequelize.models.User }
      ],
      order: [ 'id', [ sequelize.models.Comment, 'createdAt' ] ]
    });
    res.json(art.map((model) => ArtworkDTO.fromModel(model)));
  } catch (e) {
    debug(e);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
});

/**
 * Get specific artwork by ID
 * Includes comments, ordered by creation
 */
router.get('/:id(\\d+)', async function (req, res) {
  const sequelize = req.app.get('sequelize');
  try {
    const art = await sequelize.models.Artwork.findByPk(req.params.id, {
      include: [
        { model: sequelize.models.Comment, include: sequelize.models.User }
      ],
      order: [ [ sequelize.models.Comment, 'createdAt' ] ]
    });
    if (art) {
      res.json(ArtworkDTO.fromModel(art));
    } else {
      debug(`artwork ${req.params.id} not found`);
      res.status(404).json({ message: 'artwork not found' });
    }
  } catch (e) {
    debug(e);
    res.status(400).json({ message: e.message });
  }
});

/**
 * Create comment on artwork
 * Body:
 * { "content": "string", "userID": int }
 * OR
 * { "content": "string", "name": "string" }
 * The first form allows registered users to leave a comment. They may make as
 * many comments on a piece of art as they wish.
 * The second form allows unregistered "guest" users to leave a comment. A
 * guest user may only leave one comment per artwork under a given name.
 * If both a name and userID are provided, the userID takes precedence, and the
 * name is ignored.
 */
router.post('/:id(\\d+)/comments', async function (req, res) {
  const sequelize = req.app.get('sequelize');

  const artworkId = req.params.id;

  let artwork;

  // find artwork to be commented on, and make sure it exists
  try {
    artwork = await sequelize.models.Artwork.findByPk(artworkId);
    if (!artwork) {
      debug(`artwork ${artworkId} not found`);
      return res.status(404).json({ message: 'artwork not found' });
    }
  } catch (e) {
    debug(e.message);
    return res.status(400).json({ message: 'unable to retrieve artwork' });
  }

  const { error, value: body } = CommentSchema.validate(req.body);

  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    debug(`error(s) parsing body: ${messages}`);
    return res.status(422).json({ message: `invalid request: ${messages}` });
  } else {
    try {
      const newComment = await artwork.createComment(body);
      // reload necessary to populate user association, necessary to properly
      // populate name in the response
      await newComment.reload({ include: [ sequelize.models.User ] });
      return res.status(201).json(CommentDTO.fromModel(newComment));
    } catch (e) {
      if (e instanceof ForeignKeyConstraintError) {
        // because existence of artwork is already confirmed, it's safe to
        // assume that this error is related to the User ID
        debug(`user ${body.userId} does not exist`);
        return res.status(422).json({ message: 'user does not exist' });
      } else if (e instanceof UniqueConstraintError) {
        // similarly, it's safe to assume this is related to the unique guest
        // user constraint because that's the only such constraint
        debug(`guest user ${body.name} has already commented on ${artworkId}`);
        res.status(422).json({
          message: 'a non-user with this name has already commented on this work'
        });
      } else {
        debug(`error(s) creating comment: ${e.message}`);
        return res.status(422).json({ message: e.message });
      }
    }
  }
});

module.exports = router;
