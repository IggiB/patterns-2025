'use strict';

class DelayedEvent extends EventTarget {
    #counter = 0;
    #options;
    #timer;

    constructor(options) {
        super();
        this.#options = options;
        this.#initializeTimer();
    }

    #initializeTimer() {
        const { max, eventName, delay } = this.#options;
        this.#timer = setInterval(() => {
            if (this.#counter > max) {
                clearInterval(this.#timer);
                return;
            }
            const step = this.#counter++;
            const data = { detail: { step } };
            const event = new CustomEvent(eventName, data);
            this.dispatchEvent(event);
        }, delay);
    }
}

// Usage
const options = { eventName: 'step', delay: 1000, max: 10 };
const delayedEvent = new DelayedEvent(options);

delayedEvent.addEventListener(options.eventName, (event) => {
    console.log({ event, detail: event.detail });
});