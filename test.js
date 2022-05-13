// Manually exercise and test the features of uzu

import { El, Bus } from "./uzu.js";

function App () {
    const bus = Bus({
        count: 0,
    }, {cache: '_uzu_test'});
    return El('div', {
        dataset: {
            count: 'dataset-val',
        },
        attrs: {
            custom_attr: 'custom-attr',
        },
        style: {
            color: 'white',
        },
    }, [
        IncrButton(bus),
        ResetButton(bus),
        Count(bus),
    ]);
}

function IncrButton (bus) {
    return El('button', {
        on: {
            click: () => bus.pub('count', bus.vals.count + 1),
        }
    }, [
        "+1",
    ]);
}

function ResetButton (bus) {
    return El('button', {
        on: {
            click: () => bus.pub('count', 0),
        }
    }, [
        "reset",
    ]);
}

function Count (bus) {
    const input = El('input', {
        props: {
            disabled: true,
            value: bus.vals.count,
        }
    }, [
        "Count is " + bus.vals.count,
    ]);

    bus.sub('count', count => {
        input.value = count;
    });

    return El('div', {}, [
        El('label', {}, ['Count is ']),
        input,
    ]);
}

window._app = App()
document.body.appendChild(window._app);
