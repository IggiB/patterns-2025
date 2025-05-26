'use strict';

const { Basket } = require('./basket');
const { PurchaseIterator } = require('./purchase-iterator');

const purchase = [
    { name: 'Laptop',  price: 1500 },
    { name: 'Mouse',  price: 25 },
    { name: 'Keyboard',  price: 100 },
    { name: 'HDMI cable',  price: 10 },
    { name: 'Bag', price: 50 },
    { name: 'Mouse pad', price: 5 },
];

const main = async () => {
    const promiseWithResolvers = Promise.withResolvers();
    const goods = PurchaseIterator.create(purchase, promiseWithResolvers);
    const basket = new Basket({ limit: 1050 }, promiseWithResolvers);

    for await (const item of goods) {
        basket.add(item);
    }

    await basket;
    // basket.then(console.log)

    console.log('END');
};

main();