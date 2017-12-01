# metal-uri

[![Build Status](https://travis-ci.org/metal/metal-uri.svg?branch=master)](https://travis-ci.org/metal/metal-uri)

[![Build Status](https://saucelabs.com/browser-matrix/metal-uri.svg)](https://saucelabs.com/beta/builds/ef4a13a1f2ac4d77af36f1ca8c83da53)

Class for parsing and formatting URIs.

## Use

After passing a URI as a string to the constructor, the individual components of
the URI can be accessed and updated with the provided setters and getters.

### Simple use case

```javascript
import Uri from 'metal-uri';

const uri = new Uri('http://foo:8080');

uri.getHostname(); // 'foo'
uri.getPort(); // '8080'
uri.getProtocol(); // 'http:'
```

### Updating values

```javascript
const uri = new Uri('http://foo:8080/path');

uri.setPathname('login');
uri.setProtocol('https:');
uri.setHostname('bar');
uri.setPort('81');

uri.toString(); // 'https://bar:81/login'
```

### Handling query parameters

```javascript
const uri = new Uri('http://hostname?a=1&b=2');

uri.getParameterValue('a'); // '1'
uri.getParameterValue('b'); // '2'

uri.removeParameter('a');
uri.setParameterValue('b', 'x');
uri.addParameterValue('c', 'y');

uri.toString(); // 'http://hostname/?b=x&c=y'
uri.getSearch(); // '?b=x&c=y'
```

You can also set multiple values for one parameter.

```javascript
const uri = new Uri('http://hostname?a=1');

uri.addParameterValues('b', ['x', 'y']);

uri.toString(); // 'http://hostname/?a=1&b=x&b=y'
```

### Non-standard protocols

A default protocol is added automatically when none is provided. This default
value will either be `http:` or `https:` depending if you are on a secure
connection or not.

In order to use other protocols, you must instruct `Uri` to not add a default
protocol by passing `false` as the second argument.

```javascript
const uri = new Uri('tel:555-555-5555', false);

uri.setPathname('1-555-555-5555');

uri.toString(); // tel:/1-555-555-5555
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

Check out the [contributing guidelines](https://github.com/metal/metal-uri/blob/master/CONTRIBUTING.md) for more information.
