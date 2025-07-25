'use strict';
const timers = require('node:timers/promises');

// Task: implement a cancelable promise by passing `timeout: number`
// as an option to the promisified function (last argument,
// replacing the callback).

const promisify = (fn, options = { timeout: 1000 }) => (...args) => {
    let isComplete = false;
    const { promise, resolve, reject } = Promise.withResolvers();

    const timer = setTimeout(() => {
        isComplete = true;
        reject('Timeout exceeded');
    }, options.timeout);

    const callback = (err, data) => {
        clearTimeout(timer);
        if (isComplete) return;
        if (err) reject(err);
        else resolve(data);
    };

    fn(...args, callback);
    return promise;
};

// Usage

const fs = require('node:fs');
const read = promisify(async (...args) => {
    await timers.setTimeout(2000);
    fs.readFile(...args);
}, { timeout: 1000 });

// const read = promisify(fs.readFile, { timeout: 1000 });

const main = async () => {
    const fileName = 'solution.js';
    try {
        const data = await read(fileName, 'utf8');
        console.log(`File "${fileName}" size: ${data.length}`);
    } catch (e) {
        console.log(e);
    }
};

main();