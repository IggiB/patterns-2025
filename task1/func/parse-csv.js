const normalizeRowValues = ({ headers, cells, tableConfig }) => {
    return cells.map((v, i) => {
        const columnName = headers[i];
        const { type } = tableConfig[columnName];
        const isStringCell = type === 'string';
        return isStringCell ? v : parseInt(v);
    });
};

const parseCsv = (csv, tableConfig) => {
    if (!csv) return;

    const [headerLine, ...rows] = csv.trim().split('\n');

    const headers = headerLine.split(',');
    const body = rows.map((row, i) => {
        const cells = row.trim().split(',');
        return normalizeRowValues({ headers, cells, tableConfig });
    });

    return {
        headers,
        body,
    };
};

module.exports = {
    parseCsv,
}