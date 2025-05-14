const { CellTransformOptions} = require('../oop/constants');
const { CellFormater } = require('../oop/cell-formater');

class Cell {
    #value = '';
    #formatOptions = []; // cell specific formating, eg Upper case or smth
    #cellFormaterList = {
        [CellTransformOptions.Pad]: CellFormater.pad,
        [CellTransformOptions.Color]: CellFormater.color,
    };

    constructor(value) {
        this.value = value;
    }

    set value(value) {
        this.#value = value;
    }

    get value() {
        return this.#value;
    }

    storeOwnFormatOptions(formatOptions) {
        this.#formatOptions.push(...formatOptions);
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
        for (const formatOption of formatOptions) {
            const isOwnFormatingExist = this.#formatOptions.find(({ type }) => type === formatOption.type);
            if (isOwnFormatingExist) continue;
            this.#formatCell(formatOption);
        }
    }

    #applyOwnFormating() {
        for (const formatOption of this.#formatOptions) {
            this.#formatCell(formatOption);
        }
    }

    #formatCell({ type, settings }) {
        const applyFormating = this.#cellFormaterList[type];
        this.value = applyFormating(this.value, settings);
    }
}

module.exports = { Cell };