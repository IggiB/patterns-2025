const { CellTransformOptions} = require('./constants');
const { CellFormater } = require('./cell-formater');
const { TableElement } = require('./table-element');

class Cell extends TableElement {
    #value = '';
    #cellFormaterList = {
        [CellTransformOptions.Pad]: CellFormater.pad,
        [CellTransformOptions.Color]: CellFormater.color,
    };

    constructor(value = '') {
        super();
        this.value = value;
    }

    set value(value) {
        this.#value = value;
    }

    get value() {
        return this.#value;
    }

    getFormatedValue(formatOptions) {
        this.applyFormating(formatOptions);
        return this.value;
    }

    applyFormating(formatOptions) {
        this.#applyCommonFormating(formatOptions);
        this.#applyOwnFormating();
    }

    #applyCommonFormating(formatOptions) {
        for (const formatOption in formatOptions) {
            const isOwnFormatingExist = this.formatOptions[formatOption];
            if (isOwnFormatingExist) continue;
            this.#formatCell(formatOption, formatOptions[formatOption].settings);
        }
    }

    #applyOwnFormating() {
        for (const formatOption in this.formatOptions) {
            this.#formatCell(formatOption, this.formatOptions[formatOption].settings);
        }
    }

    #formatCell(type, settings) {
        const applyFormating = this.#cellFormaterList[type];
        this.value = applyFormating(this.value, settings);
    }
}

module.exports = { Cell };