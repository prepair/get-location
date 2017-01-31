function objectGet (object, expression) {
  return expression.trim().split('.').reduce((prev, curr) => prev && prev[curr], object);
}

function detectGeoApi () {
  return typeof objectGet(typeof window !== 'undefined' ? window : {}, 'navigator.geolocation.getCurrentPosition') === 'function';
}

export const hasGeoApi = detectGeoApi();

export default function getLocation (options) {
  return new Promise((resolve, reject) => {
    if (!detectGeoApi()) {
      reject(new Error('Geolocation API not available.'));
    }
    navigator.geolocation.getCurrentPosition(position => {
      resolve(position);
    }, reject, options);
  });
}
