const PadType = {
    end: 'padEnd',
    start: 'padStart',
}

const SortBy = {
    ASC: 'asc',
    DESC: 'desc'
}

class CsvNormalizer {
    static parse(csv) {
        if (!csv) return;

        const [headerLine, ...rows] = csv.trim().split('\n');

        const headers = headerLine.split(',');
        const body = rows.map((row) => {
            const values = row.trim().split(',');
            return CsvNormalizer.#normalizeRowValues(values);
        });

        return {
            headers,
            body,
        };
    }

    static #normalizeRowValues(values) {
        return values.map((v) => {
            const n = parseInt(v);
            return isNaN(n) ? v : n;
        });
    }
}

class Table {
    #headers = [];
    #body = [];

    constructor(csv) {
        const { headers, body} = CsvNormalizer.parse(csv);
        this.#headers = [...headers];
        this.#body = [...body];
    }

    drawTable(options) {
        const output = this.#body.map(row => {
            return row.map((val, i) => TableRowModifier.applyRowOptions(val, options[i])).join('');
        }).join('\n');

        console.log(output);
    }

    calculatePercentageColumn(columnName) {
        const columnIndex = this.#getColumnIndex(columnName);
        const maxVal = Math.max(...this.#body.map((row) => row[columnIndex]));

        return this.#body.map((row) => Math.round((row[columnIndex] * 100) / maxVal));
    }

    sortTable(columName, sortBy = SortBy.ASC) {
        const columnIndex = this.#getColumnIndex(columName);
        this.#body = [...this.#body].sort((a, b) => {
            return sortBy === SortBy.ASC ? b[columnIndex] - a[columnIndex] : a[columnIndex] - b[columnIndex]
        });
    }

    removeRowFromTable(columnIndex) {
        this.#headers = this.#headers.filter((_, i) => i !== columnIndex - 1);
        this.#body = this.#body.filter((_, i) => i !== columnIndex - 1);
    }

    addRowToTable({ columnIndex, columnName, rowValues }) {
        const addElemToArray = (arr, newItem, i) => [
            ...arr.slice(0, i),
            newItem,
            ...arr.slice(i),
        ];

        this.#headers = addElemToArray(this.#headers, columnName, columnIndex);
        this.#body = this.#body.map((row, i) => addElemToArray(row, rowValues[i], columnIndex));
    }

    #getColumnIndex(columnName) {
        return this.#headers.indexOf(columnName);
    }
}

class TableRowModifier {
    static applyRowOptions(item, options) {
        const optionFunctions = {
            pad: () => TableRowModifier.#padString(item, options.pad),
        };

        return Object.keys(options).reduce((acc, key) => {
            acc = optionFunctions[key]();
            return acc;
        }, item);
    }

    static #padString(item, { type, targetLength }) {
        return item.toString()[type](targetLength);
    }
}

const data = `city,population,area,density,country
  Shanghai,24256800,6340,3826,China
  Delhi,16787941,1484,11313,India
  Lagos,16060303,1171,13712,Nigeria
  Istanbul,14160467,5461,2593,Turkey
  Tokyo,13513734,2191,6168,Japan
  Sao Paulo,12038175,1521,7914,Brazil
  Mexico City,8874724,1486,5974,Mexico
  London,8673713,1572,5431,United Kingdom
  New York City,8537673,784,10892,United States
  Bangkok,8280925,1569,5279,Thailand`;

const options = [
    {
        pad: {
            type: PadType.end,
            targetLength: 18,
        }
    },
    {
        pad: {
            type: PadType.start,
            targetLength: 20,
        },
    },
    {
        pad: {
            type: PadType.start,
            targetLength: 20,
        },
    },
    {
        pad: {
            type: PadType.start,
            targetLength: 8,
        },
    },
    {
        pad: {
            type: PadType.start,
            targetLength: 18,
        },
    },
    {
        pad: {
            type: PadType.start,
            targetLength: 6,
        },
    }
];

const table = new Table(data);
const newRowValues = table.calculatePercentageColumn('density');

const newRowOptions = {
    columnIndex: 5,
    columnName: 'density percent',
    rowValues: newRowValues
};
table.addRowToTable(newRowOptions);
table.removeRowFromTable(10);
table.sortTable('density', SortBy.ASC);
table.drawTable(options);