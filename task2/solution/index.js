'use strict';

const { Basket } = require('./basket');
const { PurchaseIterator } = require('./purchase-iterator');
const { EventEmitter } = require('events');

const purchase = [
    { name: 'Laptop',  price: 1500 },
    { name: 'Mouse',  price: 25 },
    { name: 'Keyboard',  price: 100 },
    { name: 'HDMI cable',  price: 10 },
    { name: 'Bag', price: 50 },
    { name: 'Mouse pad', price: 5 },
];

const main = async () => {
    const em = new EventEmitter();
    const goods = PurchaseIterator.create(purchase, () => em.emit('DONE'));
    const basket = new Basket({ limit: 1050 });
    em.on('DONE', () => basket.notifyResult());

    for await (const item of goods) {
        basket.add(item);
    }

    console.log('END');
};

main();