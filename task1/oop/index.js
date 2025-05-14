const { CellTransformOptions, PadType, SortBy } = require('./constants');
const { TableDataset } = require('./table-dataset');

const csv = `city,population,area,density,country
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
        formatOptions: [
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
        formatOptions: [
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
        formatOptions: [
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
        formatOptions: [
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
        formatOptions: [
            {
                type: CellTransformOptions.Pad,
                settings: {
                    padType: PadType.start,
                    length: 18,
                }
            },
        ]
    },
};

const tableDataset = new TableDataset();
const table = tableDataset.createTable(csv, tableConfig, 'City population');
const densityPercentage = table.calculatePercentage(3);
const newRowOptions = {
    index: 5,
    name: 'density percent',
    values: densityPercentage,
    config: {
        type: 'number',
        formatOptions: [
            {
                type: CellTransformOptions.Pad,
                settings: {
                    padType: PadType.start,
                    length: 6,
                }
            },
        ]
    }
};
table.addColumn(newRowOptions);
table.deleteRow(10);
table.sortTable(5, SortBy.DESC);
table.addCellFormating(2, 2, [{ type: CellTransformOptions.Color, settings: { color: '\x1b[31m' }}]);
const output = table.drawTable();
console.log(output)
