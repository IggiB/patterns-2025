'use strict';

const getInstance = (factory, instances) => () => (instances.pop() ?? factory());
const addInstance = (instances, options) => (instance) => {
    if (instances.length < options.max) {
        instances.push(instance);
    }
    return instance;
};

const poolify = (factory, options) => {
    const instances = Array.from({ length: options.size }, () => factory());

    return {
        getInstance: getInstance(factory, instances),
        addInstance: addInstance(instances, options)
    };
};

// Usage
const bufferSize = 4096;
const createBuffer = (bufferSize) => () => new Uint8Array(bufferSize);
const pool = poolify(createBuffer(bufferSize), { size: 10, max: 15 });

const instance = pool.getInstance();
console.log({ instance });
pool.addInstance(instance);