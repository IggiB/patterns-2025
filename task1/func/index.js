const { calculatePercentageColumn, addRowToTable, removeRowFromTable, sortTable, drawTable } = require('./table');
const { parseCsv } = require('./parse-csv');
const { CellTransformOptions, PadType, SortBy } = require('./constants');

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
const tableConfig = {
    city: {
        type: 'string',
        transformOptions: [
            {
                type: CellTransformOptions.Pad,
                settings: {
                    padType: PadType.end,
                    length: 18,
                }
            }
        ]
    },
    population: {
        type: 'number',
        transformOptions: [
            {
                type: CellTransformOptions.Pad,
                settings: {
                    padType: PadType.start,
                    length: 20,
                }
            },
        ]
    },
    area: {
        type: 'number',
        transformOptions: [
            {
                type: CellTransformOptions.Pad,
                settings: {
                    padType: PadType.start,
                    length: 20,
                }
            },
        ]
    },
    density: {
        type: 'number',
        transformOptions: [
            {
                type: CellTransformOptions.Pad,
                settings: {
                    padType: PadType.start,
                    length: 8,
                }
            },
        ]
    },
    country: {
        type: 'string',
        transformOptions: [
            {
                type: CellTransformOptions.Pad,
                settings: {
                    padType: PadType.start,
                    length: 18,
                }
            },
        ]
    },
    'density percent': {
        type: 'number',
        transformOptions: [
            {
                type: CellTransformOptions.Pad,
                settings: {
                    padType: PadType.start,
                    length: 6,
                }
            },
        ]
    },

};

const table = parseCsv(data, tableConfig);
const newRowValues = calculatePercentageColumn(table, 'density');
const newRowOptions = {
    columnIndex: 5,
    columnName: 'density percent',
    rowValues: newRowValues
};
const tableWithNewRow = addRowToTable(table, newRowOptions);
const tableWithRemovedRow = removeRowFromTable(tableWithNewRow, 10);
const sortedTable = sortTable(tableWithRemovedRow, 'density', SortBy.ASC);
const tableToDraw = drawTable(sortedTable, tableConfig);
console.log(tableToDraw);