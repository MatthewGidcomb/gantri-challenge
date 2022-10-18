const request = require('supertest');
const app = require('../app.js');
const { resetDb, createUser } = require('./utils.js');
const { expect } = require('chai');

describe('User', function () {
  const user1 = { name: 'Ahren', age: 24, location: 'San Francisco' };
  const user2 = { name: 'John', age: 28, location: 'San Francisco' };

  beforeEach(async function () {
    await resetDb();
    await createUser({ ...user1 });
  });

  it('get route returns all users', function () {
    return request(app)
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function (res) {
        const body = res.body;
        expect(body).to.be.an('array');
        expect(body).to.have.lengthOf(1);
        expect(body[0]).to.be.an('object');
        expect(body[0].name).to.equal(user1.name);
      });
  });

  describe('post route', function () {

    it('creates new user', function () {
      return request(app)
        .post('/api/users')
        .send({ ...user2 })
        .expect(201)
        .expect(function (res) {
          const body = res.body;
          expect(body).to.be.an('object');
          expect(body).to.haveOwnProperty('id');
          expect(body.name).to.equal(user2.name);
        })
        .then(async function () {
          const sequelize = app.get('sequelize');
          const users = await sequelize.models.User.findAll();
          expect(users).to.have.lengthOf(2);
        });
    });

    it('rejects invalid request', function () {
      return request(app)
        .post('/api/users')
        .send({ name: 'Newby', age: 10 })
        .expect(422)
        .expect(function (res) {
          const body = res.body;
          expect(body).to.be.an('object')
          expect(body.message).to.be.a('string');
        });
    });
  });
});
