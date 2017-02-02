'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;
exports.teardown = teardown;
exports.default = getLocation;
function objectGet(object, expression) {
  return expression.trim().split('.').reduce((prev, curr) => prev && prev[curr], object);
}

function detectGeoApi() {
  return typeof objectGet(typeof window !== 'undefined' ? window : {}, 'navigator.geolocation.getCurrentPosition') === 'function';
}

function round(val, precision) {
  return Math.floor(val * Math.pow(10, precision)) / Math.pow(10, precision);
}

// geopos is read only in the browser context, this effectively freezes
// the geoposition + coord objects, which may not be that great
// see also: https://www.npmjs.com/package/geoposition-to-object
function cloneGeo(gl) {
  let ret = { timestamp: gl.timestamp, coords: {} };
  let coordKeys = ['accuracy', 'altitude', 'altitudeAccuracy', 'heading', 'latitude', 'longitude', 'speed'];
  coordKeys.forEach(key => {
    if (typeof gl.coords[key] !== 'undefined') {
      ret.coords[key] = gl.coords[key];
    }
  });
  return ret;
}

// ----

const hasGeoApi = exports.hasGeoApi = detectGeoApi();

let globalOptions;
function setup(options) {
  globalOptions = Object.assign({}, globalOptions, options);
}

function teardown() {
  globalOptions = null;
}

function getLocation(options) {
  if (globalOptions) {
    options = Object.assign({}, options, globalOptions);
  }

  let precision = (options || {}).precision;
  let hasPrecision = typeof precision === 'number';
  if (hasPrecision) {
    // this is not an official parameter, throw it away
    delete options.precision;
  }

  return new Promise((resolve, reject) => {
    if (!detectGeoApi()) {
      reject(new Error('Geolocation API not available.'));
    }
    navigator.geolocation.getCurrentPosition(position => {
      let latitude = objectGet(position, 'coords.latitude');
      let longitude = objectGet(position, 'coords.longitude');
      let clone;
      if (hasPrecision) {
        clone = cloneGeo(position);
        if (latitude) {
          clone.coords.latitude = round(latitude, precision);
        }
        if (longitude) {
          clone.coords.longitude = round(longitude, precision);
        }
      }
      resolve(clone || position);
    }, reject, options);
  });
}