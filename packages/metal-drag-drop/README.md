# metal-drag-drop

[![Build Status](https://travis-ci.org/metal/metal-drag-drop.svg?branch=master)](https://travis-ci.org/metal/metal-drag-drop)

Metal's drag and drop component.

## Use

### Simple use case

This instance of `Drag` will allow any element with the `box` class to be
dragged, but only when clicking a child element that has the `handle` class.

```html
<div class="box">
  <div class="handle" tabindex="0"></div>
</div>
<div class="box">
  <div class="handle" tabindex="0"></div>
</div>
```

```javascript
import {Drag} from 'metal-drag-drop';

new Drag({
  handles: '.handle',
  sources: '.box'
});
```

![drag](https://github.com/metal/metal-drag-drop/blob/master/images/drag.gif "Drag")

### Locking axis

The drag elements can be locked to a specified axis, the following example would
only allow the elements to move along the y axis.

```javascript
new Drag({
  axis: 'y',
  sources: '.box'
});
```

The same can be done for the x axis.

```javascript
new Drag({
  axis: 'x',
  sources: '.box'
});
```

### Constraining

By setting the `constrain` element, the drag elements will not be allowed to
leave the defined element's region.

```javascript
new Drag({
  constrain: '#container', // Parent element of `.box` elements
  sources: '.box'
});
```

### Steps

The `steps` config property defines how much the drag elements will move by at a
time.

```javascript
new Drag({
  sources: '.box',
  steps: {
    x: 50,
    y: 150
  }
});
```

![steps](https://github.com/metal/metal-drag-drop/blob/master/images/step.gif "Steps")

### Cloning drag element

Rather than dragging the element itself, a clone can be created in it's place.

```javascript
new Drag({
  dragPlaceholder: Drag.Placeholder.CLONE,
  sources: '.box'
});
```

![clone](https://github.com/metal/metal-drag-drop/blob/master/images/clone.gif "Cloned Element")

### Drag Drop

The `DragDrop` class extends from the `Drag` class, but adds additional config
properties for defining target drop areas and behavior.

```html
<div class="box"></div>
<div class="target"></div>
```

```javascript
import {DragDrop} from 'metal-drag-drop';

const dragDrop = new DragDrop({
  sources: '.box',
  targets: '.target'
});

dragDrop.on(DragDrop.Events.END, function(data, event) {
  event.preventDefault();

  console.log('Hit target:', data.target); // <div class="target"></div>
});
```

### Events

The `Drag` class emits three events that can be listened to.

```javascript
const drag = new Drag({
  sources: '.box'
});

drag.on(Drag.Events.DRAG, function(event) {
  // Logic
});

drag.on(Drag.Events.END, function(event) {
  // Logic
});

drag.on(Drag.Events.START, function(event) {
  // Logic
});
```

The `DragDrop` class adds two additional events related to drop targets.

```javascript
const dragDrop = new DragDrop({
  sources: '.box',
  targets: '.target'
});

dragDrop.on(DragDrop.Events.TARGET_ENTER, function(event) {
  // Logic
});

dragDrop.on(DragDrop.Events.TARGET_LEAVE, function(event) {
  // Logic
});
```

### More examples

For more examples, check out the [demos](https://github.com/metal/metal-drag-drop/tree/master/demos).

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

4. Build the code:

  ```
  npm run build
  ```

5. Open the demo at demos/index.html on your browser.

## Contributing

Check out the [contributing guidelines](https://github.com/metal/metal-drag-drop/blob/master/CONTRIBUTING.md) for more information.
