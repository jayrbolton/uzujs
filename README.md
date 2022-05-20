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

### Design pattern

A typical design pattern for a component would be to:

* Initialize the bus with default values
* Create a plain object holding event functions that update the bus
* Write a hierarchy of DOM nodes, where DOM events can trigger your event functions
* Subscribe to data updates on the bus, and update the DOM

A very simple counter example might look like:

```js
import {El, Bus} from './include/uzu.js';

function Counter () {
  // Initialize the message bus for this component
  const bus = Bus({
    count: 0,
  }, {cache: "_counter"});
  // Define some events that publish data to the bus
  const events = {
    incr () {
      bus.pub("count", bus.vals.count + 1);
    },
    decr () {
      bus.pub("count", bus.vals.count - 1);
    },
    reset () {
      bus.pub("count", 0);
    },
  };
  // Define our DOM nodes and styles
  const el = El("div", {
    style: {
      fontFamily: "Helvetica sans-serif",
      fontSize: "1.2rem",
    }
  }, [
    // Embed child components
    CountText(bus),
    IncrButton(events),
    DecrButton(events),
    ResetButton(events),
  ]);
  return {el, bus};
}

function IncrButton (events) {
  return El("button", {
    on: {click: events.incr},
  }, ["Increment"]);
}

function DecrButton (events) {
  return El("button", {
    on: {click: events.decr},
  }, ["Decrement"]);
}

function ResetButton (events) {
  return El("button", {
    on: {click: events.reset},
  }, ["Reset"]);
}

function CountText (bus) {
  const text = () => "Count is " + bus.vals.count;
  const el = El("p", {}, [
    text(),
  ]);
  // Update the DOM
  bus.sub("count", () => {
    el.textContent = text();
  });
  return el
}

// Initialize the root level component and append it to the page
const counter = Counter();
window._bus = counter.bus; // for debugging
document.body.appendChild(counter.el);
```
