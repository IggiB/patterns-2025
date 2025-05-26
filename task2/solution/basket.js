class Basket {
    #items = [];
    #failedCases = [];
    #total = 0;
    #options;
    #promiseWithResolvers;

    constructor(options, promiseWithResolvers) {
        this.#options = options;
        this.#promiseWithResolvers = promiseWithResolvers;
    }

    add(item) {
        const total = this.#total + item.price;
        const isLimitExceeded = total > this.#options.limit;
        if (isLimitExceeded) {
            this.#handleExceededLimit(total, item);
        } else {
            this.#addValidItem(total, item);
        }
    }

    async then(onFulfilled, onRejected) {
        await this.#promiseWithResolvers.promise;
        const result = {
            items: this.#items,
            total: this.#total,
            failedCases: this.#failedCases
        };
        console.log('Final basket result', result);
        return onFulfilled(result);
    }

    #addValidItem(total, item) {
        this.#total = total;
        this.#items.push(item);
        console.log('Item added to basket', item);
        console.log('Basket total', this.#total);
    }

    #handleExceededLimit(total, item) {
        console.log('Basket money limit exceeded, item is not added to basket', item);
        this.#failedCases.push({
            item,
            reason: `Basket money limit exceeded. Total limit: ${this.#options.limit}, exceeded amount: ${total - this.#total};`
        });
    }
}

module.exports = { Basket };