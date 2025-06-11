class PurchaseIterator {
    #current = 0;
    #purchase;
    #onDone;

    constructor(purchase, onDone) {
        this.#purchase = purchase;
        this.#onDone = onDone;
    }

    static create(purchase, onDone) {
        return new PurchaseIterator(purchase, onDone);
    }

    [Symbol.asyncIterator]() {
        return {
            next: () => {
                const isDone = this.#current >= this.#purchase.length;
                if (isDone) {
                    this.#onDone();
                }

                return {
                    value: this.#purchase[this.#current++],
                    done: isDone
                };
            },
        }
    }

}

module.exports = { PurchaseIterator };