const { TableElement } = require('./table-element');

class Row extends TableElement {
    init({ formatOptions } = {}) {
        this.addFormatOptions(formatOptions);
    }
}

module.exports = { Row };