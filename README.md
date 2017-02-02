# get-location

Get geolocation with a promise.

## installation

```shell
npm i -S @prepair/get-location
```

* Requires browser environment (geolocation api).
* Transpiled to node v6+ context (no need for [mocha babel workarounds](https://github.com/react-native-material-design/react-native-material-design/issues/103)).

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
