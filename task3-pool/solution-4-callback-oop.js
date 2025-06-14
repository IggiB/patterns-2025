'use strict';

class Queue {
    #items = {};
    #frontIndex = 0;
    #backIndex = 0;

    get size() {
        return this.#backIndex - this.#frontIndex;
    }

    get isEmpty() {
        return this.size === 0;
    }

    enqueue(item) {
        this.#items[this.#backIndex] = item;
        this.#backIndex++;
        return item;
    }

    dequeue() {
        if (this.isEmpty) {
            return undefined;
        }
        const item = this.#items[this.#frontIndex];
        delete this.#items[this.#frontIndex];
        this.#frontIndex++;
        return item;
    }
}

class Pool {
    #factory;
    #options;
    #poolItems;
    #processing = 0;
    #delayedQueue = new Queue();

    constructor(factory, options) {
        this.#factory = factory;
        this.#options = options;
        this.#poolItems = Array.from({ length: options.size }, () => ({ instance: factory(), isFree: true }));
    }

    get(callback) {
        if (this.#processing < this.#options.max) {
            const poolItem = this.#poolItems.find(instance => instance.isFree);
            poolItem.isFree = false;
            callback(poolItem.instance);
        } else {
            this.#delayedQueue.enqueue(callback);
        }
    }

    release(instance) {
        const poolItem = this.#poolItems.find(poolItem => poolItem.instance === instance);
        if (!poolItem) {
            throw new Error('Invalid instance');
        }
        const callback = this.#delayedQueue.dequeue();
        if (callback) {
            callback(instance);
        } else {
            poolItem.isFree = true;
            this.#processing--;
        }
    }
}

// Usage
const bufferSize = 4096;
const createBuffer = () => new Uint8Array(bufferSize);
const pool = new Pool(createBuffer, { size: 10, max: 15 });

let i = 0;
const next = () => {
    pool.get((data) => {
        i++;
        if (i < 20) {
            setTimeout(next, i * 10);
            setTimeout(() => pool.release(data), i * 100);
        }
    });
    console.log('DONE');
};

next();