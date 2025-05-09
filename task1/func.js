const PadType = {
    end: 'padEnd',
    start: 'padStart',
}

const SortBy = {
    ASC: 'asc',
    DESC: 'desc'
}

const normalizeRowValues = (values) => {
    return values.map((v) => {
        const n = parseInt(v);
        return isNaN(n) ? v : n;
    });
};

const parseCsv = (csv) => {
    if (!csv) return;

    const [headerLine, ...rows] = csv.trim().split('\n');

    const headers = headerLine.split(',');
    const body = rows.map((row) => {
        const values = row.trim().split(',');
        return normalizeRowValues(values);
    });

    return {
        headers,
        body,
    };
};

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

const addElemToArray = (arr, newItem, i) => [
    ...arr.slice(0, i),
    newItem,
    ...arr.slice(i),
];

const addRowToTable = ({ headers, body }, { columnIndex, columnName, rowValues }) => {
    return {
        headers: addElemToArray(headers, columnName, columnIndex),
        body: body.map((row, i) => addElemToArray(row, rowValues[i], columnIndex)),
    }
};

const padString = (item, { type, targetLength }) => {
    return item.toString()[type](targetLength);
};

const applyRowOptions = (item, options) => {
    const optionFunctions = {
        pad: () => padString(item, options.pad),
    };

    return Object.keys(options).reduce((acc, key) => {
        acc = optionFunctions[key]();
        return acc;
    }, item);
};

const drawTable = ({ body }, options) => {
    const output = body.map(row => {
        return row.map((val, i) => applyRowOptions(val, options[i])).join('');
    }).join('\n');

    console.log(output);
};

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

const table = parseCsv(data);
const newRowValues = calculatePercentageColumn(table, 'density');
const newRowOptions = {
    columnIndex: 5,
    columnName: 'density percent',
    rowValues: newRowValues
};
const tableWithNewRow = addRowToTable(table, newRowOptions);
const tableWithRemovedRow = removeRowFromTable(tableWithNewRow, 10);
const sortedTable = sortTable(tableWithRemovedRow, 'density', SortBy.ASC);

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
drawTable(sortedTable, options);