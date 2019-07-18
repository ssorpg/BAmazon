// REQUIRES
const mysql = require('mysql2/promise');
const connectionParams = require('./connectionParams');



// FUNCTIONS

// GENERAL
function addStringFloats(float1, float2) {
    let floatNum = parseFloat(float1) + parseFloat(float2);
    return floatNum.toString();
}

// PRODUCTS
function getProductByName(productList, name) {
    let foundProduct = productList.find((curProduct) => { return curProduct.product_name === name; });

    return foundProduct;
}

function displayProduct(product) {
    console.log('\nProduct ' + product.item_id);
    console.log('Name: ' + product.product_name);
    console.log('Price: $' + product.price);
}

function displayAllProducts(productList) {
    productList.forEach(product => {
        displayProduct(product);
    });
}

// MYSQL
async function getTableList(table) {
    try {
        let connection = await mysql.createConnection(connectionParams);
        let [productList] = await connection.query(
            `SELECT * FROM ${table}`
        );
        connection.end();

        return productList;
    } catch (err) {
        console.log(err);
        return;
    }
}

async function updateTable(table, product) {
    try {
        let connection = await mysql.createConnection(connectionParams);
        await connection.query(
            `UPDATE ${table} SET ? WHERE item_id = ? `,
            [
                product,
                product.item_id
            ]
        );
        connection.end();
    } catch (err) {
        console.log(err);
        return;
    }
}

async function addToTable(table, newItem) {
    try {
        let connection = await mysql.createConnection(connectionParams);
        await connection.query(
            `INSERT INTO ${table} SET ?`,
            [
                newItem
            ]
        );
        connection.end();
    } catch (err) {
        console.log(err);
        return;
    }
}

async function getProfitTable() {
    try {
        let connection = await mysql.createConnection(connectionParams);
        let [table] = await connection.query(
            `
            SELECT 
                department_id,
                departments.department_name,
                over_head_costs,
                SUM(product_sales) AS product_sales,
                SUM(product_sales) - over_head_costs AS total_profit
            FROM
                departments
            LEFT JOIN
                products ON departments.department_name = products.department_name
            GROUP BY
                department_id
            `
        );
        connection.end();

        return table;
    } catch (err) {
        console.log(err);
        return;
    }
}

function formatProfitTable(profitTable) {
    let formattedTable = [];

    profitTable.forEach(department => {
        department.over_head_costs = '$' + parseFloat(department.over_head_costs).toFixed(2);
    
        if (department.product_sales === null) {
            department.product_sales = '$0.00';
            department.total_profit = '-' + department.over_head_costs;
        }
        else {
            department.product_sales = '$' + parseFloat(department.product_sales).toFixed(2);
            department.total_profit = '$' + parseFloat(department.total_profit).toFixed(2);
        }
    
        formattedTable.push(department);
    });

    return formattedTable;
}



// EXPORTS
module.exports = {
    // GENERAL
    addStringFloats: addStringFloats,
    
    // PRODUCTS
    getProductByName: getProductByName,
    displayProduct: displayProduct,
    displayAllProducts: displayAllProducts,

    // MYSQL
    getTableList: getTableList,
    updateTable: updateTable,
    addToTable: addToTable,
    getProfitTable: getProfitTable,
    formatProfitTable: formatProfitTable
};
