class Basket {
    #items = [];
    #failedCases = [];
    #total = 0;
    #options;
    #em;

    constructor(options, em) {
        this.#options = options;
        this.#em = em;
        this.#em.on('DONE', () => this.#notifyResult());
    }

    add(item) {
        const total = this.#total + item.price;
        if (total > this.#options.limit) {
            console.log('Basket money limit exceeded, item is not added to basket', item);
            this.#failedCases.push({
                item,
                reason: `Basket money limit exceeded. Total limit: ${this.#options.limit}, exceeded amount: ${total - this.#total};`
            });
        } else {
            this.#total = total;
            this.#items.push(item);
            console.log('Item added to basket', item);
            console.log('Basket total', this.#total);
        }
    }

    then(onFulfilled, onRejected) {
        return onFulfilled();
    }

    #notifyResult() {
        const result = {
            items: this.#items,
            total: this.#total,
            failedCases: this.#failedCases
        };
        console.log('Basket result: ', result);
    }
}

module.exports = { Basket };