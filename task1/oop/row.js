const { addElemToArray } = require('./utils');
const { Cell } = require('./cell');

class Row {
    #cells = [];

    constructor(length, values) {
        this.fillRow(length, values)
    }

    fillRow(length, values= []) {
        for (let i = 0; i < length; ++i) {
            const cell = new Cell(values[i] ?? '');
            this.#cells.push(cell);
        }
    }

    addCell(value, index) {
        const cell = new Cell(value ?? '');
        this.#cells = index > -1 ? addElemToArray(this.#cells, cell, index) : this.#cells.push(cell);
    }

    clearCell(index) {
        const cell = this.#cells[index];
        cell.value('');
    }

    getCellByIndex(index) {
        return this.#cells[index];
    }

    getFormatedCellValue(formatOptions, i) {
        const cell = this.getCellByIndex(i);
        return cell.getFormatedValue(formatOptions);
    }


}

module.exports = { Row };