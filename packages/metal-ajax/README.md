# metal-ajax

[![Build Status](https://travis-ci.org/metal/metal-ajax.svg?branch=master)](https://travis-ci.org/metal/metal-ajax)

[![Build Status](https://saucelabs.com/browser-matrix/metal-ajax.svg)](https://saucelabs.com/beta/builds/ff7b6c3bec2e49cd80c02db948bc88ce)

Low-level Metal.js utility to perform Ajax requests. If you're looking for
something higher level, take a look
at [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch).

## Use

### Simple request

```javascript
import Ajax from 'metal-ajax';

Ajax.request('/url', 'get')
  .then(xhrResponse => {
    // Handle response
  });
```

### Posts

```javascript
Ajax.request('/url', 'post', 'requestBody')
  .then(xhrResponse => {
    // Handle response
  });
```

### Request headers and params

Custom request headers and params can bet set
using a `MultiMap` from [metal-structs](https://github.com/metal/metal-structs).

```javascript
import {MultiMap} from 'metal-structs';

const headers = new MultiMap();
const params = new MultiMap();

headers.add('content-type', 'application/json');
params.add('foo', 'bar');

Ajax.request('/url', 'get', null, headers, params)
  .then(function(xhrResponse) {
    // Handle response
  });
```

### Catching errors

```javascript
Ajax.request('/url', 'get')
  .then(xhrResponse => {
    // Handle response
  })
  .catch(error => {
    // Handle error
  });
```

### Watch for progress

In order for the `progress` listener to work, the response _must_ have
the [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) response
header set.

```javascript
Ajax.request('/url', 'get')
  .progress(progress => {
    // Fires with a value between 0 and 1 representing the percent
  })
  .then(xhrResponse => {
    // Handle response
  })
```

## Setup

1. Install a recent release of [NodeJS](https://nodejs.org/en/download/) if you
don't have it yet.

2. Install local dependencies:

  ```
  npm install
  ```

3. Run the tests:

  ```
  npm test
  ```

## Contributing

Check out the [contributing guidelines](https://github.com/metal/metal-ajax/blob/master/CONTRIBUTING.md) for more information.
