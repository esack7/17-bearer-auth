'use strict';

const faker = require('faker');
const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
// const Gallery = require('../../model/gallery');

describe('Testing Gallery Routes', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(mocks.gallery.removeAll);
  afterEach(mocks.user.removeAll);

  describe('POST to /api/gallery', function() {
    describe('Valid Requests', () => {
      beforeAll(() => {
        this.fakeGalleryData = { name: faker.random.word(), desc: faker.random.words(12) };

        return mocks.user.createOne()
          .then(userData => this.userData = userData)
          .then(() => {
            return superagent.post(':4444/api/gallery')
              .set('Authorization', `Bearer ${this.userData.token}`)
              .send(this.fakeGalleryData);
          })
          .then(res => this.res = res);
      });

      test('should return a status of 201', () => {
        expect(this.res.status).toBe(201);
      });
      test('should return a new gallery in the res', () => {
        expect(this.res.body.name).toBe(this.fakeGalleryData.name);
        expect(this.res.body.desc).toBe(this.fakeGalleryData.desc);
      });
      test('should have a userId property', () => {
        expect(this.res.body).toHaveProperty('userId');
        expect(this.res.body.userId.toString()).toBe(this.userData.user._id.toString());
      });
    });

    describe('Invalid Requests', () => {
      test('should return a status of 401 given no Auth credentials',  () => {
        return superagent.post(':4444/api/gallery')
          .send(this.fakeGalleryData)
          .catch(err => {
            expect(err.status).toBe(401);
          });
      });

      test('should return a 401 given bad Auth credintials', () => {
        return superagent.post(':4444/api/gallery')
          .set('Authorization', 'Bearer badToken')
          .send(this.fakeGalleryData)
          .catch(err => {
            expect(err.status).toBe(401);
          });
      });

      xtest('should return 400 given bad req body', () => {
        return superagent.post(':4444/api/gallery')
          .set('Authorization', `Bearer ${this.userData.token}`)
          .send({})
          .catch(err => {
            expect(err.status).toBe(400);
          });
      });
    });
  });

  describe('GET to /api/gallery', function() {
    describe('Valid Requests', () => {

    });

    describe('Invalid Requests', () => {

    });
  });

  describe('PUT to /api/gallery', function() {
    describe('Valid Requests', () => {

    });

    describe('Invalid Requests', () => {

    });
  });

  describe('DELETE to /api/gallery', function() {
    describe('Valid Requests', () => {

    });

    describe('Invalid Requests', () => {

    });
  });
});
