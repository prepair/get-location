# get-location

Get geolocation with a promise.

## installation

```shell
npm i -S @prepair/get-location
```

* Requires browser environment (geolocation api).
* Transpiled to es2015+ie context (polyfills not included).

## usage

### hasGeoApi

```js
import { hasGeoApi } from '@prepair/get-location';

console.log(hasGeoApi); // true or false
```

### getLocation

```js
import getLocation from '@prepair/get-location';

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

### setup

```js
import getLocation, { setup as getLocationSetup } from '@prepair/get-location';

getLocationSetup({ precision: 0 });
getLocation().then(console.log);
```

## caveats

Using the additional parameters (`precision` for now) will clone the result object,
which would be read only otherwise. Clone deep is manual and deterministic, further
api changes in the `Geoposition` object will not be reflected. Do NOT use `instanceOf`
on the result.

## development

* the node context is not exactly the same as the browser context (hence the `typeof window`)
* `npm run release` now does a test build, so the release will **fail** if you have an outdated
  lib, in that case do a `chore(build): latest lib` commit
