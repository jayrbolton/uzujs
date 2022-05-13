# :shell: uzu.js

A minimalistic set of tools for creating UIs, mostly for my own benefit.

I wanted a basic set of tooling for creating single page apps without any packaging, dependencies, minification, bundling, virtual DOM, or other complications.

## Usage

Given a file structure like:

```
/index.html
/main.js
/include/uzu.js
```

Include your `main.js` as a module:


```html
<script type='module' src='main.js'></script>
```

And then use import uzu to use it:

```js
// main.js
import { El } from './include/uzu.js'
```

## Examples

* [Countdown timer](https://github.com/jayrbolton/countdown-timer)
* [Caffeine tracker](https://github.com/jayrbolton/hafcaf)

## API

For now, there are only two things to use: `Bus` and `El`.

`El` is a convenience wrapper for creating plain DOM nodes:

```js
El(tagname, options, children);
```

```js
const el = El('input', {
  // Set inline CSS (`node.style.color = 'pink'`)
  style: {color: "pink"},
  // Set any properties (`node.disabled = true`)
  props: {disabled: true},
  // Event handlers (`node.addEventListener('click', fn)`)
  on: {
    click: () => {
      // do something..
    },
  },
  // Set attributes (`node.setAttribute('a', 'b')`)
  attrs: {a: "b"},
  // Set data-attributes (`node.dataset.x = 'y'`)
  dataset: {x: "y"},
}, [
  "child text node",
  El('span', {}, [ "child dom node" ]),
]);
```

`Bus` allows you to publish messages from many sources to a single place, and then have a single place where you handle those messages, such as updating the DOM based on changes to certain data.

```js
Bus(messages, options);
```

```js
const bus = Bus({
  count: 0,
}, {cache: '_my_localstorage_key'});

// increment
bus.pub('count', bus.vals.count + 1)

// reset
bus.pub('count', 0)

// subscribe to changes
bus.sub('count', count => {
  // update the dom to reflect changes
});
```

The only option for now is `cache: key`, allowing you to automatically save all changes to the bus state to a localStorage key, specified by `key`.
