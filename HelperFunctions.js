// REQUIRES
const mysql = require('mysql2/promise');
const connectionParams = require('./ConnParams');



// FUNCTIONS
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

async function getProductList() {
    try {
        let connection = await mysql.createConnection(connectionParams);
        let [productList] = await connection.query(
            `SELECT * FROM products`
        );
        connection.end();

        return productList;
    } catch (err) {
        console.log(err);
    }
}

async function updateDatabase(product) {
    try {
        let connection = await mysql.createConnection(connectionParams);
        await connection.query(
            `UPDATE products SET ? WHERE item_id = ? `,
            [
                product,
                product.item_id
            ]
        );
        connection.end();
    } catch (err) {
        console.log(err);
    }
}

async function addToDatabase(newItem) {
    try {
        let connection = await mysql.createConnection(connectionParams);
        await connection.query(
            `INSERT INTO products SET ?`,
            [
                newItem
            ]
        );
        connection.end();
    } catch (err) {
        console.log(err);
    }
}



// EXPORTS
module.exports = {
    getProductByName: getProductByName,
    displayProduct: displayProduct,
    displayAllProducts: displayAllProducts,
    getProductList: getProductList,
    updateDatabase: updateDatabase,
    addToDatabase: addToDatabase
};