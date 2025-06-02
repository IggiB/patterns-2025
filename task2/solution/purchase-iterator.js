class PurchaseIterator {
    #current = 0;
    #purchase;

    constructor(purchase) {
        this.#purchase = purchase;
    }

    static create(purchase) {
        return new PurchaseIterator(purchase);
    }

    [Symbol.asyncIterator]() {
        return {
            next: () => {
                const isDone = this.#current >= this.#purchase.length;

                return {
                    value: this.#purchase[this.#current++],
                    done: isDone
                };
            },
        }
    }

}

module.exports = { PurchaseIterator };