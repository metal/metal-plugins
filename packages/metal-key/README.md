# metal-key

Adds a custom event that helps listen to key events in a cleaner way

## Setup

`npm install --save-dev metal-key`

## How to use

Import dom from `metal-dom` module to have access to the `on()` or `delegate()` methods.

Import `metal-key` module. It will add some custom events that you can bind to. You don't need extra configuration or using any exported value from the file.

For example, say you want to listen to the `Enter` key and execute a function once it happens. Your file should seems like:

```
import dom from 'metal-dom';
import 'metal-key';

dom.on('keydown:enter', function() {
  console.log('Enter key was pressed');
});
```

## Contribute

We'd love to get contributions from you! Please, check our [Contributing Guidelines](CONTRIBUTING.md) to see how you can help us improve.
