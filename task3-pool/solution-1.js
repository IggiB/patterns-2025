'use strict';

const poolify = (factory, options) => {
    const getInstance = () => (instances.pop() ?? factory());
    const addInstance = () => {
        if (instances.length < options.max) {
            instances.push(instance);
        }
        return instance;
    };

    const instances = Array.from({ length: options.size }, factory);

    return {
        getInstance: getInstance,
        addInstance: addInstance
    };
};

// Usage
const bufferSize = 4096;
const createBuffer = (bufferSize) => () => new Uint8Array(bufferSize);
const pool = poolify(createBuffer(bufferSize), { size: 10, max: 15 });

const instance = pool.getInstance();
console.log({ instance });
pool.addInstance(instance);