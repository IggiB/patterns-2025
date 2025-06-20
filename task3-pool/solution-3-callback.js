'use strict';

const queue = () => {
    const items = {};
    let frontIndex = 0;
    let backIndex = 0;

    const size = () => backIndex - frontIndex;
    const isEmpty = () => size() === 0;

    const enqueue = (item) => {
        items[backIndex] = item;
        backIndex++;
        return item;
    };

    const dequeue = () => {
        if (isEmpty()) {
            return undefined;
        }
        const item = items[frontIndex];
        delete items[frontIndex];
        frontIndex++;

        return item;
    }

    return {
        enqueue,
        dequeue,
    };
};

const poolify = (factory, {size, max}) => {
    const poolItems = Array.from({ length: size }, () => ({ instance: factory(), isFree: true }));
    const delayedQueue = queue();
    let processing = 0;

    const get = (callback) => {
        if (processing < max) {
            const poolItem = poolItems.find(instance => instance.isFree);
            poolItem.isFree = false;
            callback(poolItem.instance);
        } else {
            delayedQueue.enqueue(callback);
        }
    };

    const release = (instance) => {
        const poolItem = poolItems.find(poolItem => poolItem.instance === instance);
        if (!poolItem) {
            throw new Error('Invalid instance');
        }
        const callback = delayedQueue.dequeue();
        if (callback) {
            callback(instance);
        } else {
            poolItem.isFree = true;
            processing--;
        }
    };

    return {
        get,
        release
    };
};

// Usage
const bufferSize = 4096;
const createBuffer = (bufferSize) => () => new Uint8Array(bufferSize);
const pool = poolify(createBuffer(bufferSize), { size: 10, max: 15 });

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