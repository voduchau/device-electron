const Store = require('electron-store');

const store = new Store();

const store2 = Store.initRenderer();
console.log(store2,'store2 ne xxx');
module.exports = store;
