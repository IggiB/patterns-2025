const { Table } = require('./table');

class TableDataset {
    #tables = {};

    createTable(csv, tableConfig, tableName) {
        if (this.#tables[tableName]) {
            throw new Error(`Table with name ${tableName} already exists`)
        }

        const parsedCsv = this.#parseCsv(csv, tableConfig);
        const table = new Table(parsedCsv, tableConfig, tableName);
        this.#tables[tableName] = table;

        return table;
    }

    #parseCsv(csv, tableConfig) {
        if (!csv) return;

        const [headerLine, ...rows] = csv.trim().split('\n');

        const headers = headerLine.split(',');
        const body = rows.map((row, i) => {
            const values = row.trim().split(',');
            return this.#normalizeValues({ headers, values, tableConfig });
        });

        return {
            headers,
            body,
        };
    }

    #normalizeValues({ headers, values, tableConfig }) {
        return values.map((v, i) => {
            const columnName = headers[i];
            const { type } = tableConfig[columnName];
            const isStringCell = type === 'string';
            return isStringCell ? v : parseInt(v);
        });
    }
}

module.exports = { TableDataset };