const { PadType} = require('./constants');

class CellFormater {
    static pad(value, { padFrom, length }) {
        const strCellVal = value.toString();
        return padFrom === PadType.end ? strCellVal.padEnd(length) : strCellVal.padStart(length);
    }

    static color(value, { color }) {
        const strCellVal = value.toString();
        return color + strCellVal + '\x1b[0m';
    }
}

module.exports = { CellFormater };