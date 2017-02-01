function objectGet (object, expression) {
  return expression.trim().split('.').reduce((prev, curr) => prev && prev[curr], object);
}

function detectGeoApi () {
  return typeof objectGet(typeof window !== 'undefined' ? window : {}, 'navigator.geolocation.getCurrentPosition') === 'function';
}

function round (val, precision) {
  return Math.floor(val * Math.pow(10, precision)) / Math.pow(10, precision);
}

// geoloc is read only in the browser context, this effectively freezes
// the geoposition object, which may not be that great
function cloneGeo (gl) {
  let ret = { timestamp: gl.timestamp, coords: {} };
  Object.keys(gl.coords).forEach(key => { ret.coords[key] = gl.coords[key]; });
  return ret;
}

export const hasGeoApi = detectGeoApi();

export default function getLocation (options) {
  let precision = (options || {}).precision;
  let hasPrecision = typeof precision === 'number';
  if (hasPrecision) { // this is not an official parameter, throw it away
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
        clone = cloneGeo(position); // poor man's clonedeep
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
