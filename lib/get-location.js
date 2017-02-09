'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;
exports.teardown = teardown;
exports.default = getLocation;
function objectGet(object, expression) {
  return expression.trim().split('.').reduce(function (prev, curr) {
    return prev && prev[curr];
  }, object);
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
  var ret = { timestamp: gl.timestamp, coords: {} };
  var coordKeys = ['accuracy', 'altitude', 'altitudeAccuracy', 'heading', 'latitude', 'longitude', 'speed'];
  coordKeys.forEach(function (key) {
    if (typeof gl.coords[key] !== 'undefined') {
      ret.coords[key] = gl.coords[key];
    }
  });
  return ret;
}

// ----

var hasGeoApi = exports.hasGeoApi = detectGeoApi();

var globalOptions = void 0;
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

  var precision = (options || {}).precision;
  var hasPrecision = typeof precision === 'number';
  if (hasPrecision) {
    // this is not an official parameter, throw it away
    delete options.precision;
  }

  return new Promise(function (resolve, reject) {
    if (!detectGeoApi()) {
      reject(new Error('Geolocation API not available.'));
    }
    navigator.geolocation.getCurrentPosition(function (position) {
      var latitude = objectGet(position, 'coords.latitude');
      var longitude = objectGet(position, 'coords.longitude');
      var clone = void 0;
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