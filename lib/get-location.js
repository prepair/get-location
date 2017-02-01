function objectGet (object, expression) {
  return expression.trim().split('.').reduce((prev, curr) => prev && prev[curr], object);
}

function detectGeoApi () {
  return typeof objectGet(typeof window !== 'undefined' ? window : {}, 'navigator.geolocation.getCurrentPosition') === 'function';
}

function round (val, precision) {
  return Math.floor(val * Math.pow(10, precision)) / Math.pow(10, precision);
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
      if (hasPrecision) {
        if (latitude) {
          position.coords.latitude = round(latitude, precision);
        }
        if (longitude) {
          position.coords.longitude = round(longitude, precision);
        }
      }
      resolve(position);
    }, reject, options);
  });
}
