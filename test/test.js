/* eslint no-undef: 0 */

'use strict';

const logger = require('heroku-logger');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const chaiJson = require('chai-json');
chai.use(chaiHttp);
chai.use(chaiJson);

const server = require('../src/index');

const envParams = [
  'NODE_ENV',
  'DYNO',
  'PORT',
  'HEROKU_TEST_RUN_NUMBER',
  'CI',
  'CI_NODE_INDEX',
  'HEROKU_TEST_RUN_BRANCH',
  'WEB_CONCURRENCY',
  'WEB_MEMORY',
  'MEMORY_AVAILABLE'
];

const testLogger = logger.clone({level: 'info'});

testLogger.info(`PATH: ${process.env.PATH}`);
testLogger.info(`npm_config_user_agent: ${process.env.npm_config_user_agent}`);

envParams.forEach((item) => {
  testLogger.info(`${item}: ${process.env[item.toString()] || 'n/a'} `);
});

describe('When the page loads', () => {
  it('it should respond with a 200', (done) => {
    chai.request(server)
      .get('/')
      .end( (err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        done();
      });
  });

  it('it should display the correct content', (done) => {
    chai.request(server)
      .get('/')
      .end( (err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        done();
      });
  });

  it('it should not show a 404', (done) => {
    chai.request(server)
      .get('/')
      .end( (err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        done();
      });
  });
});

describe('When test exiftool', () => {
  it('it should respond with a 200, response should be an Object and should have property FileName', (done) => {
    chai.request(server)
      .get('/test/exif')
      .end( (err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        res.body.should.be.instanceof(Object);
        JSON.parse(res.text).should.have.property('FileName');
        done();
      });
  });
});

describe('If you try to access a non-existing page', () => {
  it('it should show status 404', (done) => {
    chai.request(server)
      .get('/errorpage')
      .end( (err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(404);
        done();
      });
  });
});
