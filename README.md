# get-location

Get geolocation with a promise.

## installation

```shell
npm i -S @prepair/get-location
```

* Requires browser environment (es2015 webpack/babel transpiler).
* Promise, import (no shims)

## usage

```js
import getLocation, { hasGeoApi } from '@prepair/get-location';

console.log(hasGeoApi); // true or false

getLocation({
    // https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: Infinity
    // extensions
    precision: 6
  })
  .then(loc => console.log(loc.coords))
  .catch(console.error);
```
