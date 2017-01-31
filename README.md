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

getLocation()
  .then(loc => console.log(loc.coords))
  .catch(console.error);
```
