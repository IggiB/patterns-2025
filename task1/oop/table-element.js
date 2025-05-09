class TableElement {
    #formatOptions = {};

    get formatOptions() {
        return this.#formatOptions;
    }

    addFormatOptions(formatOptions = {}) {
        this.#formatOptions = {
            ...this.formatOptions,
            ...formatOptions,
        };
    }

    removeFormatOptions(formatOptions = {}) {
        for (let key in formatOptions) {
            this.#formatOptions[key] = undefined;
        }
    }
}

module.exports = { TableElement };