# metal-css-transitions
[![Build Status](https://travis-ci.org/metal/metal-css-transitions.svg?branch=master)](https://travis-ci.org/metal/metal-css-transitions)
[![npm](https://img.shields.io/npm/dm/metal-css-transitions.svg)](https://www.npmjs.com/package/metal-css-transitions)
[![npm](https://img.shields.io/npm/v/metal-css-transitions.svg)](https://www.npmjs.com/package/metal-css-transitions)

Metal component used to apply css transitions

## [Demo](http://metal.github.io/metal-css-transitions/)

## Usage

```js
import TransitionWrapper from 'metal-css-transitions';

<TransitionWrapper name="some-animation">
  <div>1</div>
  <div>2</div>
</TransitionWrapper>
```

```scss
.some-animation-appear {
  opacity: 0;
}

.some-animation-appear.some-animation-appear-active {
  transition: opacity 1000ms;
  opacity: 1;
}
```

| Prop | Type | Description | Default |
| -------- | ---- | ----------- | ------- |
| **name** | string | Name of css transition. | `''` |

#### Transitions

| Type | Example CSS | When? |
| ---- | ---- | ---- |
| appear | `.foo-appear {} .foo-appear-active {}` | When <TransitionWrapper /> is attached |
| enter | `.foo-enter {} .foo-enter-active {}` | When new child component is attached. |
| leave | `.foo-leave {} .foo-leave-active {}` | When child is about to detach. |

All transitions respect the duration specified in the css.
