const { SortBy, CellTransformOptions, PadType } = require('./constants');
const { addElemToArray } = require('./utils.js');

const getColumnIndex = (headers, columnName) => {
    return headers.indexOf(columnName);
};

const calculatePercentageColumn = ({ body, headers }, columnName) => {
    const columnIndex = getColumnIndex(headers, columnName);
    const maxVal = Math.max(...body.map((row) => row[columnIndex]));
    return body.map((row) => Math.round((row[columnIndex] * 100) / maxVal));
};

const sortTable = ({ headers, body }, columName, sortBy = SortBy.ASC) => {
    const columnIndex = getColumnIndex(headers, columName);
    const sortedBody = [...body].sort((a, b) => sortBy === SortBy.ASC ? b[columnIndex] - a[columnIndex] : a[columnIndex] - b[columnIndex]);
    return {
        headers,
        body: sortedBody,
    };
};

const removeRowFromTable = ({ headers, body }, columnIndex) => {
    return {
        headers: headers.filter((_, i) => i !== columnIndex - 1),
        body: body.filter((_, i) => i !== columnIndex - 1)
    }
};

const addRowToTable = ({ headers, body }, { columnIndex, columnName, rowValues }) => {
    return {
        headers: addElemToArray(headers, columnName, columnIndex),
        body: body.map((row, i) => addElemToArray(row, rowValues[i], columnIndex)),
    }
};

const addCellPadding = (cellVal, { from, length }) => {
    const strCellVal = cellVal.toString();
    return from === PadType.end ? strCellVal.padEnd(length) : strCellVal.padStart(length);
};

const transformCell = (cellVal, transformOptions) => {
    const cellTransformers = {
        [CellTransformOptions.Pad]: addCellPadding,
    };

    return transformOptions.reduce((acc, { type, settings }) => {
        const applyTransform = cellTransformers[type];
        acc = applyTransform(cellVal, settings);
        return acc;
    }, cellVal);
};

const transformRow = ({ headers, row, tableConfig }) => {
    return row.map((cellVal, i) => {
        const columnName = headers[i];
        const cellConfig = tableConfig[columnName];
        return transformCell(cellVal, cellConfig.transformOptions)
    }).join('');
}

const drawTable = ({ body, headers }, tableConfig) => {
    return body.map(row => transformRow({ headers, row, tableConfig })).join('\n');
};

module.exports = {
    drawTable,
    sortTable,
    removeRowFromTable,
    addRowToTable,
    calculatePercentageColumn,
}