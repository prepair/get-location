import { expect } from 'chai';
import { spy } from 'sinon';
import getLocation, { hasGeoApi } from './get-location';

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
        getCurrentPosition: () => {}
      }
    };
    global.window = { navigator };
  });

  it('should get location from browser geolocation api using a promise', function * () {
    navigator.geolocation.getCurrentPosition = spy((resolve, reject) => { resolve(geoData); });
    let loc = yield getLocation();
    expect(navigator.geolocation.getCurrentPosition).to.have.been.called;
    expect(loc).to.eql(geoData);
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
    expect(hasGeoApi).to.be.false;
  });
});
