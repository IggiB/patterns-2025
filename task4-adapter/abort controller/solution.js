'use strict';

// Task: implement cancellation by passing `AbortSignal` as an option
// to the promisified function (last argument, replacing the callback).
// Hint: Create `AbortController` or `AbortSignal` in the usage section.

const promisify = (fn) => (...args) => {
    const promise = new Promise((resolve, reject) => {
        const callback = (err, data) => {
            if (err) reject(err);
            else resolve(data);
        };
        fn(...args, callback);
    });
    return promise;
};

// Usage

const fs = require('node:fs');
const timers = require("node:timers/promises");
const read = promisify(async (...args) => {
    await timers.setTimeout(2000);
    fs.readFile(...args);
});
//const read = promisify(fs.readFile);


const main = async () => {
    const timeoutSignal = AbortSignal.timeout(1000);
    timeoutSignal.onabort = () => console.log('Aborted');

    try {
        const fileName = 'exercise.js';
        const data = await read(fileName, { signal: timeoutSignal, encoding: 'utf8'});
        console.log(`File "${fileName}" size: ${data.length}`);
    } catch (e) {
        console.log(e.message);
    }
};

main();