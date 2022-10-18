const request = require('supertest');
const app = require('../app.js');
const { resetDb, createUser, createArt, createComment } = require('./utils.js');
const { expect } = require('chai');

describe('Art', function () {
  const art = { title: 'Poppies', artist: 'Monet', year: 1873 };
  const artId = 1;
  const user = { name: 'Ahren', age: 24, location: 'San Francisco' };
  const userId = 1;

  const baseComment = { content: 'Interesting', userId };

  beforeEach(async function () {
    await resetDb();
    await createArt({ ...art });
    await createUser({ ...user });
  });

  describe('list route', function () {

    it('returns all artworks', function () {
      return request(app)
        .get('/api/art')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          const body = res.body;
          expect(body).to.be.an('array');
          expect(body).to.have.lengthOf(1);
          expect(body[0]).to.be.an('object');
          expect(body[0].title).to.equal(art.title);
        });
    });

    it('includes comments', async function () {
      await createComment(artId, { ...baseComment });
      return request(app)
        .get('/api/art')
        .expect(function (res) {
          const body = res.body;
          expect(body[0].comments).to.be.an('array');
          expect(body[0].comments).to.have.lengthOf(1);
          expect(body[0].comments[0].content).to.equal(baseComment.content);
          expect(body[0].comments[0].name).to.equal(user.name);
        });
    });
  });

  describe('get route', function () {

    it('returns a single artwork', function () {
      return request(app)
        .get(`/api/art/${artId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          const body = res.body;
          expect(body).to.be.an('object');
          expect(body.title).to.equal(art.title);
        });
    });

    it('includes comments', async function () {
      await createComment(artId, { ...baseComment });
      return request(app)
        .get(`/api/art/${artId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          const body = res.body;
          expect(body).to.be.an('object');
          expect(body.comments).to.be.an('array');
          expect(body.comments[0].content).to.equal(baseComment.content);
          expect(body.comments[0].name).to.equal(user.name);
        });
    });

    it('rejects non-existent artwork', function () {
      return request(app)
        .get('/api/art/2')
        .expect(404)
        .expect(function (res) {
          const body = res.body;
          expect(body).to.be.an('object');
          expect(body.message).to.be.a('string');
        })
    });
  });

  describe('post comment route', function () {
    const userComment = { content: 'Fascinating', userID: userId };
    const guestComment = { content: 'Underwhelming', name: 'Mark' };

    it ('creates a new comment from a registered user', function () {
      return request(app)
        .post(`/api/art/${artId}/comments`)
        .send({ ...userComment })
        .expect(201)
        .expect(function (res) {
          const body = res.body;
          expect(body).to.be.an('object');
          expect(body).to.haveOwnProperty('id');
          expect(body.content).to.equal(userComment.content);
          expect(body.userID).to.equal(userComment.userID);
          expect(body.name).to.equal(user.name);
        })
        .then(async function () {
          await request(app)
            .get(`/api/art/${artId}`)
            .expect(function (res) {
              const body = res.body;
              const comments = body.comments;
              expect(comments).to.have.lengthOf(1);
              expect(comments[0].content).to.equal(userComment.content);
              expect(comments[0].userID).to.equal(userComment.userID);
              expect(comments[0].name).to.equal(user.name);
            });
        });
    });

    it('creates a new comment from a non-user', function () {
      return request(app)
        .post(`/api/art/${artId}/comments`)
        .send({ ...guestComment })
        .expect(201)
        .expect(function (res) {
          const body = res.body;
          expect(body).to.be.an('object');
          expect(body).to.haveOwnProperty('id');
          expect(body.content).to.equal(guestComment.content);
          expect(body).not.to.haveOwnProperty('userID');
          expect(body.name).to.equal(guestComment.name);
        })
        .then(async function () {
          await request(app)
            .get(`/api/art/${artId}`)
            .expect(function (res) {
              const body = res.body;
              const comments = body.comments;
              expect(comments).to.have.lengthOf(1);
              expect(comments[0].content).to.equal(guestComment.content);
              expect(comments[0]).not.to.haveOwnProperty('userID');
              expect(comments[0].name).to.equal(guestComment.name);
            });
        });
    });

    it('creates multiple comments from the same user on the same work', async function () {
      await createComment(artId, { ...baseComment });
      return request(app)
        .post(`/api/art/${artId}/comments`)
        .send({ ...userComment })
        .expect(201)
        .then(async function () {
          await request(app)
            .get(`/api/art/${artId}`)
            .expect(function (res) {
              const body = res.body;
              const comments = body.comments;
              expect(comments).to.have.lengthOf(2);
              expect(comments[0].userID).to.equal(userId);
              expect(comments[0].name).to.equal(user.name);
              expect(comments[1].userID).to.equal(userId);
              expect(comments[1].name).to.equal(user.name);
            });
        });
    });

    it('rejects multiple comments from the same non-user on the same work', async function () {
      await createComment(artId, { ...guestComment });
      return request(app)
        .post(`/api/art/${artId}/comments`)
        .send({ content: 'Heh Heh', name: guestComment.name })
        .expect(422)
        .expect(function (res) {
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.be.a('string');
        });
    });

    it('ignores name when userID is provided', function () {
      return request(app)
        .post(`/api/art/${artId}/comments`)
        .send({ ...userComment, name: 'Ignored' })
        .expect(201)
        .then(async function () {
          await request(app)
            .get(`/api/art/${artId}`)
            .expect(function (res) {
              const body = res.body;
              const comments = body.comments;
              expect(comments).to.have.lengthOf(1);
              expect(comments[0].userID).to.equal(userId);
              expect(comments[0].name).to.equal(user.name);
            });
        });
    });

    it('rejects invalid requests', function () {
      return request(app)
        .post(`/api/art/${artId}/comments`)
        .send({ content: 'Heh Heh' })
        .expect(422)
        .expect(function (res) {
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.be.a('string');
        });
    });

    it('rejects invalid userId in request', function () {
      return request(app)
        .post(`/api/art/${artId}/comments`)
        .send({ content: 'Heh Heh', userID: 1000 })
        .expect(422)
        .expect(function (res) {
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.be.a('string');
        });
    });

    it('rejects invalid artwork ID in route', function () {
      return request(app)
        .post(`/api/art/2/comments`)
        .send({ content: 'oops', userID: 1 })
        .expect(404);
    });
  });
});
