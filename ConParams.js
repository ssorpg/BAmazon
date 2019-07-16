// REQUIRES
const keys = require('./Keys');



// GLOBALS
const connectionParams = {
    host: 'localhost',
    port: 3306,
    user: keys.mySQL.username,
    password: keys.mySQL.password,
    database: 'bamazon'
};



// EXPORTS
module.exports = connectionParams;