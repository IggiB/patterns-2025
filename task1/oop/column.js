class Column {
    #name = '';
    #type = 'string';
    #formatOptions = [];

    constructor(name, { type, formatOptions }) {
        this.#name = name;
        this.#type = type;
        this.#storeFormatOptions(formatOptions);
    }

    get type() {
        return this.type;
    }

    get name() {
        return this.#name;
    }

    getFormatOptions() {
        return this.#formatOptions;
    }

    #storeFormatOptions(formatOptions) {
        this.#formatOptions.push(...formatOptions);
    }
}

module.exports = { Column };