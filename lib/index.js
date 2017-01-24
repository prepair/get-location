"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getLocation;
function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => {
      resolve(position);
    }, reject);
  });
}