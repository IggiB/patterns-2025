class PurchaseIterator {
    #current = 0;
    #purchase;
    #em;

    constructor(purchase, em) {
        this.#purchase = purchase;
        this.#em = em;
    }

    static create(purchase, em) {
        return new PurchaseIterator(purchase, em);
    }

    [Symbol.asyncIterator]() {
        return {
            next: () => {
                const isDone = this.#current >= this.#purchase.length;
                if (isDone) {
                    this.#em.emit('DONE');
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