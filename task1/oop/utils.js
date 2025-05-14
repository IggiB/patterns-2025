const addElemToArray = (arr, newItem, i) => [
    ...arr.slice(0, i),
    newItem,
    ...arr.slice(i),
];

module.exports = {
    addElemToArray,
}