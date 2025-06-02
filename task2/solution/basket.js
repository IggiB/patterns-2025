class Basket {
    #items = [];
    #failedCases = [];
    #total = 0;
    #options;
    #callbacks = [];

    constructor(options) {
        this.#options = options;
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

    finalize() {
        const initialResult = {
            items: this.#items,
            total: this.#total,
            failedCases: this.#failedCases
        };

        let currentResult = initialResult;
        for (const { onFulfilled, onRejected } of this.#callbacks) {
            try {
                currentResult = onFulfilled(currentResult);
            } catch (error) {
                currentResult = onRejected(error);
                break;
            }
        }
        return currentResult;
    }

    then(onFulfilled, onRejected) {
        this.#callbacks.push({ onFulfilled, onRejected });
        return this;
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