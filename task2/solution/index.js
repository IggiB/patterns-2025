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
    const goods = PurchaseIterator.create(purchase);
    const basket = new Basket({ limit: 1050 });
    basket
        .then((res) => console.dir(res, { depth: null }), console.error)
        .then(() => console.log('END 2'))
        .then(() => console.log('END 3'))

    for await (const item of goods) {
        basket.add(item);
    }

    basket.finalize();
    console.log('END');
};

main();