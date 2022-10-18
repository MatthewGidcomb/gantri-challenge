const Joi = require('joi');

const commentSchema = Joi.object({
  content: Joi.string().required(),
  // note: spec uses `userID` but we use `userId` in DB for consistency
  userId: Joi.number().integer().min(1),
  // userId is optional, but if not specified then name is required
  name: Joi.string().max(255).when('userId', {
    is: Joi.any().valid(null),
    then: Joi.required()
  })
}).rename('userID', 'userId');

// note: name should be ignored if userID is specified, but unless it's removed
// from the final payload, Sequelize will persist it, potentially interfering
// with the table constraint that enforces unique non-user comments per artwork
// Joi doesn't handle that well, so here we wrap the actual schema object and
// do some post-processing.
module.exports = {
  validate: function (body) {
    const { error, value } = commentSchema.validate(body);

    // if a registered user is commenting, we can (and should) ignore the specified name
    if (value && Object.prototype.hasOwnProperty.call(value, 'userId')) {
      delete value.name;
    }

    return { error, value };
  }
};
