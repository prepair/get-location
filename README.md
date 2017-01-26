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
import getLocation from '@prepair/get-location';

document.addEventListener('DOMContentLoaded', () => {
  getLocation()
    .then(data => console.log(data.coords))
    .catch(console.error);
});
```
