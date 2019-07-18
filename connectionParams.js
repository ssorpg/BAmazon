// REQUIRES
const keys = require('./keys');



// GLOBALS
const connectionParams = {
    host: 'localhost',
    port: 3306,
    user: keys.mySQL.username,
    password: keys.mySQL.password,
    database: 'BAmazon'
};



// EXPORTS
module.exports = connectionParams;