const sinon = require('sinon');
const mocha = require('mocha');
const coMocha = require('co-mocha');

coMocha(mocha);

beforeEach(function () {
  this.sandbox = sinon.sandbox.create();
});

afterEach(function () {
  this.sandbox.restore();
});
