# get-location

Get geolocation with a promise. Requires browser environment (es2015 webpack/babel).

## installation

```
npm i -S @prepair/get-location
```

Requires es2016 context, use babel/webpack.

## usage

```
import getLocation, { hasGeoApi } from './get-location';

console.log(hasGeoApi); // true or false

getLocation()
  .then(loc => console.log(loc.coords))
  .catch(console.error);
```
