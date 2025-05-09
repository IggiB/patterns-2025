const { Row } = require('./row');
const { Column } = require('./column');
const { Cell } = require('./cell');
const { SortBy } = require('./constants');

class Table {
    #name = 'New table';
    #columns = [];
    #rows = [];
    #cellsMatrix = [];

    #defaultColumnsNumber = 50;
    #defaultRowsNumber = 50;

    constructor() {
        this.#initializeEmptyTable();
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        this.#name = name;
    }

    drawTable() {
        return this.#cellsMatrix.map((row, rowIndex) => {
            const rowFormating = this.#rows[rowIndex].formatOptions;
            return row.map((cell, columnIndex) => {
                const columnFormating = this.#columns[columnIndex].formatOptions;

                const commonFormatting = {
                    ...columnFormating,
                    ...rowFormating,
                };

                return cell.getFormatedValue(commonFormatting);
            }).join(' ');
        }).join('\n');
    }

    importDataToTable({ headers, body, columnsConfig, rowsConfig = [] }) {
        this.#columns = Array.from({ length: headers.length}).map((_, i) => {
            const columnName = headers[i];
            const columnConfig = columnsConfig[columnName];
            const column = new Column();
            column.init({ name: columnName, config: columnConfig });
            return column;
        });
        this.#rows = Array.from({ length: body.length }, (_, i) => {
            const rowConfig = rowsConfig[i];
            const row = new Row();
            row.init(rowConfig);
            return row;
        });
        this.#initializeTableCells(body);
    }

    updateCellValue({ rowIndex, columnIndex, value = ''}) {
        const cell = this.#cellsMatrix[rowIndex][columnIndex];
        cell.value = value;
    }

    addColumn({ index, name, values = [], config }) {
        const columnIndex = index > -1 ? index : this.#columns.length;
        const column = new Column();
        column.init({ name, config });
        this.#columns.splice(columnIndex, 0, column);
        this.#cellsMatrix.map((row, rowIndex) => {
            const cell = new Cell(values[rowIndex] ?? '');
            this.#cellsMatrix[rowIndex].splice(columnIndex, 0, cell);
        });

    }

    deleteColumn(index) {
        this.#columns.splice(index, 1);
        this.#cellsMatrix.map((row) => row.splice(index, 1));
    }

    addRow({ index, values = [], config = {} }) {
        const rowIndex = index > -1 ? index : this.#rows.length;
        const row = new Row();
        row.init(config);
        this.#rows.splice(rowIndex, 0, row);

        const rowLength = values.length || this.#columns.length || this.#defaultColumnsNumber;

        if (rowLength > this.#columns.length) {
            const difference = rowLength - this.#columns.length;
            for (let i = 1; i < difference; ++i) {
                const column = new Column();
                this.#columns.push(column);
            }
        }

        const cells = [];
        for (let i = 0; i <= rowLength; ++i) {
            const cell = new Cell(values[i] ?? '');
            cells.push(cell);
        }
        this.#cellsMatrix.splice(rowIndex, 0, cells);
    }

    deleteRow(rowIndex) {
        this.#rows.splice(rowIndex, 1);
        this.#cellsMatrix.splice(rowIndex, 1);
    }

    sortTable(index, sortBy = SortBy.ASC) {
        this.#cellsMatrix.sort((a, b) => {
            const cell1 = a[index];
            const cell2 = b[index];
            return sortBy === SortBy.ASC ? cell1.value - cell2.value : cell2.value - cell1.value
        });
    }

    addCellFormating({ rowIndex, columnIndex, formatOptions }) {
        const cell = this.#cellsMatrix[rowIndex][columnIndex];
        cell.addFormatOptions(formatOptions);
    }

    calculatePercentage(index) {
        const allColumnValues = this.#getAllColumnValues(index);
        const maxVal = Math.max(...allColumnValues);

        return allColumnValues.map((val) => Math.round((val * 100) / maxVal));
    }

    #initializeEmptyTable() {
        this.#columns = new Array(this.#defaultColumnsNumber).fill(new Column());
        this.#rows = new Array(this.#defaultRowsNumber).fill(new Row());
        this.#initializeTableCells();
    }

    #initializeTableCells(values = []) {
        this.#cellsMatrix = [];
        const rowsNumber = values.length || this.#defaultRowsNumber;
        const columnsNumber = values.length ? values[0].length : this.#defaultColumnsNumber;
        for (let r = 0; r < rowsNumber; ++r) {
            const row = [];
            for (let c = 0; c < columnsNumber; ++c) {
                const value = values[r]?.[c] ?? '';
                const cell = new Cell(value);
                row.push(cell);
            }
            this.#cellsMatrix.push(row);
        }
    }

    #getAllColumnValues(columnIndex) {
        return this.#cellsMatrix.map((row) => {
            const cell = row[columnIndex];
            return cell.value;
        });
    }
}

module.exports = { Table };