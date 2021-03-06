import { expect } from 'chai';
import { spy } from 'sinon';
import getLocation, { setup, teardown, hasGeoApi } from './get-location';

describe('get-location', () => {
  let geoData = {
    coords: {
      latitude: 47.4735167,
      longitude: 19.14525489998
    },
    timestamp: 1485433339015
  };

  beforeEach(function () {
    let navigator = global.navigator = {
      geolocation: {
        getCurrentPosition: spy((resolve, reject) => { resolve(geoData); })
      }
    };
    global.window = { navigator };
  });

  afterEach(() => {
    teardown();
  });

  it('should get location from browser geolocation api using a promise', async function () {
    let loc = await getLocation();
    expect(navigator.geolocation.getCurrentPosition).to.have.been.called;
    expect(loc).to.eql(geoData);
  });

  it('should use the precision parameter and mask it from the browser api', async function () {
    let loc = await getLocation({ precision: 3 });
    expect(navigator.geolocation.getCurrentPosition).to.have.been.called;
    expect(navigator.geolocation.getCurrentPosition.firstCall.args[2]).to.be.empty;
    expect(loc).to.eql({
      coords: {
        latitude: 47.473,
        longitude: 19.145
      },
      timestamp: 1485433339015
    });
  });

  it('should be able to setup a global parameter object', async function () {
    setup({ precision: 0 });
    let loc = await getLocation({ precision: 3 });
    expect(loc.coords.latitude).to.equal(47);
    expect(loc.coords.longitude).to.equal(19);

    // mostly for testing
    teardown();
    loc = await getLocation();
    expect(loc.coords.latitude).to.equal(47.4735167);
    expect(loc.coords.longitude).to.equal(19.14525489998);
  });

  it('should not remove real api params', async function () {
    await getLocation({ enableHighAccuracy: true });
    expect(navigator.geolocation.getCurrentPosition).to.have.been.called;
    expect(navigator.geolocation.getCurrentPosition.firstCall.args[2]).to.eql({
      enableHighAccuracy: true
    });
  });

  it('should reject a promise if the user denies access to the geolocation data', function (done) {
    navigator.geolocation.getCurrentPosition = (resolve, reject) => { reject(new Error('User denied Geolocation')); };
    getLocation().then(() => {}).catch(err => {
      expect(err).to.be.instanceOf(Error); // probably browser PositionError, but we have no browser context in the test
      done();
    });
  });

  it('should throw an error if the geolocation api is not available', (done) => {
    delete window.navigator;
    getLocation().then(() => {}).catch(err => {
      expect(err).to.be.instanceOf(Error);
      expect(err.message).to.equal('Geolocation API not available.');
      done();
    });
  });

  it('should have a hasGeoApi exported constant', () => {
    expect(hasGeoApi).to.be.a.boolean;
  });
});
