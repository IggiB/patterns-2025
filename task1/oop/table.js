const { Row } = require('./row');
const { Column } = require('./column');
const { addElemToArray } = require('./utils');
const { SortBy } = require('./constants');

class Table {
    #name = '';
    #columns = [];
    #rows = [];

    constructor({ headers, body }, config, name) {
        this.#name = name;
        this.#setColumns(headers, config);
        this.#setRows(body);
    }

    drawTable() {
        return this.#rows.map((row, i) => {
            return this.#getFormatedCellsValues(row, i).join('');
        }).join('\n');
    }

    addColumn({ index, name, values, config }) {
        const columnIndex = index > -1 ? index : this.#columns.length;
        this.#columns = addElemToArray(this.#columns, new Column(name, config), columnIndex);
        this.#rows.map((row, i) => row.addCell(values[i], columnIndex));
    }

    deleteColumn(index) {
        this.#columns = this.#columns.filter((_, i) => i !== index - 1);
        this.deleteRow(index);
    }

    addRow(index, values = []) {
        this.#rows = addElemToArray(this.#rows, new Row(this.#columns.length, values), index);
    }

    deleteRow(columnIndex) {
        this.#rows = this.#rows.filter((_, i) => i !== columnIndex - 1);
    }

    sortTable(index, sortBy = SortBy.ASC) {
        this.#rows = [...this.#rows].sort((a, b) => {
            const cell1 = a.getCellByIndex(index);
            const cell2 = b.getCellByIndex(index);
            return sortBy === SortBy.ASC ? cell1.value - cell2.value : cell2.value - cell1.value
        });
    }

    addCellFormating(rowIndex, columnIndex, formatOptions) {
        const row = this.#rows[rowIndex];
        const cell = row.getCellByIndex(columnIndex);
        cell.storeOwnFormatOptions(formatOptions);
    }

    calculatePercentage(index) {
        const allColumnValues = this.#getAllColumnValues(index);
        const maxVal = Math.max(...allColumnValues);

        return allColumnValues.map((val) => Math.round((val * 100) / maxVal));
    }

    #setColumns(headers, config) {
        this.#columns = headers.map((val) => {
            const columnConfig = config[val];
            return new Column(val, columnConfig);
        });
    }

    #setRows(body) {
        this.#rows = body.map((rowValue) => {
            return new Row(rowValue.length, rowValue);
        });
    }

    #getColumnByIndex(index) {
        return this.#columns[index];
    }

    #getAllColumnValues(index) {
        return this.#rows.map((row) => {
            const cell = row.getCellByIndex(index);
            return cell.value;
        });
    }

    #getFormatedCellsValues(row, index) {
        return this.#columns.map((column, i) => {
            const columnFormatOptions = column.getFormatOptions();
            return row.getFormatedCellValue(columnFormatOptions, i);
        });
    }
}

module.exports = { Table };