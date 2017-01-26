export default function getLocation () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => {
      resolve(position);
    }, reject);
  });
}
