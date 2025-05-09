const { CellTransformOptions, PadType, SortBy } = require('./constants');
const { TableDataset } = require('./table-dataset');

function renderPopulationTable() {
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
        name: 'City population',
        columnsConfig: {
            city: {
                type: 'string',
                formatOptions: {
                    [CellTransformOptions.Pad]: {
                        settings: {
                            padType: PadType.end,
                            length: 18,
                        }
                    },
                }
            },
            population: {
                type: 'number',
                formatOptions: {
                    [CellTransformOptions.Pad]: {
                        settings: {
                            padType: PadType.start,
                            length: 20,
                        }
                    },
                }
            },
            area: {
                type: 'number',
                formatOptions: {
                    [CellTransformOptions.Pad]: {
                        settings: {
                            padType: PadType.start,
                            length: 20,
                        }
                    },
                }
            },
            density: {
                type: 'number',
                formatOptions: {
                    [CellTransformOptions.Pad]: {
                        settings: {
                            padType: PadType.start,
                            length: 8,
                        }
                    },
                }
            },
            country: {
                type: 'string',
                formatOptions: {
                    [CellTransformOptions.Pad]: {
                        settings: {
                            padType: PadType.start,
                            length: 18,
                        }
                    },
                }
            },
        },
        rowsConfig: [
            {
                formatOptions:
                    {
                        [CellTransformOptions.Color]: {
                            settings: { color: '\x1b[31m' }
                        },
                    }
            }
        ]
    };

    const tableDataset = new TableDataset();
    const table = tableDataset.createTable(csv, tableConfig);

    const densityPercentage = table.calculatePercentage(3);
    const newRowOptions = {
        index: 5,
        name: 'density percent',
        values: densityPercentage,
        config: {
            type: 'number',
            formatOptions: {
                [CellTransformOptions.Pad]: {
                    settings: {
                        padType: PadType.start,
                        length: 6,
                    }
                }
            },
        }
    };
    table.addColumn(newRowOptions);
    table.deleteRow(9);
    table.sortTable(5, SortBy.DESC);
    table.addCellFormating({
        rowIndex: 2,
        columnIndex: 2,
        formatOptions: { [CellTransformOptions.Color]: { settings: { color: '\x1b[31m' }} }
    });
    table.addCellFormating({
        rowIndex: 0,
        columnIndex: 2,
        formatOptions: { [CellTransformOptions.Color]: { settings: { color: '\x1b[43m' }} }
    });
    table.deleteColumn(3);

    const output = table.drawTable();
    console.log(output)
}

renderPopulationTable();
