const { TableElement } = require('./table-element');

class Column extends TableElement {
    #name = '';

    init({ name = '', config: { formatOptions } }) {
        this.#name = name;
        this.addFormatOptions(formatOptions);
    }

    set name(val) {
        this.#name = val;
    }

    get name() {
        return this.#name;
    }
}

module.exports = { Column };