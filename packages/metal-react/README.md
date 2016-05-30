# metal-react

A function that transforms React components into Metal.js components

## Usage

Just call the `bridge` function with the constructor of the react component
you wish to use, and it will return a metal component you can use instead.
For example:

```javascript
import bridge from 'metal-react';
import SomeReactComponent from 'some-react-module';

var MetalComponent = bridge(SomeReactComponent);
```

Now you can use `MetalComponent` inside your
[metal-jsx](http://npmjs.com/package/metal-jsx) code in the same way
that you'd use `SomeReactComponent`. For example:

```javascript
render() {
  return <MetalComponent foo="foo" />
}
```

## Setup

1. Install NodeJS >= v0.12.0 and NPM >= v3.0.0, if you don't have it yet. You
can find it [here](https://nodejs.org).

2. Install local dependencies:

  ```
  npm install
  ```

3. Build the code:

  ```
  npm run build
  ```
