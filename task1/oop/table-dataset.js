const { Table } = require('./table');

class TableDataset {
    #tables = {};

    createTable(csv, { name, columnsConfig, rowsConfig}) {
        if (this.#tables[name]) {
            throw new Error(`Table with name ${name} already exists`)
        }

        const parsedCsv = this.#parseCsv(csv, columnsConfig);
        const table = new Table();
        table.importDataToTable({
            ...parsedCsv,
            columnsConfig,
            rowsConfig,
        });
        this.#tables[name] = table;

        return table;
    }

    getTableByName(name) {
        return this.#tables[name];
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