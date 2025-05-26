class PurchaseIterator {
    #current = 0;
    #purchase;
    #promiseWithResolvers;

    constructor(purchase, promiseWithResolvers) {
        this.#purchase = purchase;
        this.#promiseWithResolvers = promiseWithResolvers;
    }

    static create(purchase, promiseWithResolvers) {
        return new PurchaseIterator(purchase, promiseWithResolvers);
    }

    [Symbol.asyncIterator]() {
        return {
            next: () => {
                const isDone = this.#current >= this.#purchase.length;
                if (isDone) {
                    setTimeout(() => this.#promiseWithResolvers.resolve('DONE'), 2000);
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