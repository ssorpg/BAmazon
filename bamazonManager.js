// REQUIRES
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const connectionParams = require('./ConnParams');
const helper = require('./HelperFunc');



// FUNCTIONS
async function connectToMySQL() {
    try {
        let connection = await mysql.createConnection(connectionParams);
        let [productList] = await connection.query(
            `SELECT * FROM products`
        );

        askProduct(productList);
        connection.end();
    } catch (err) {
        console.log(err);
    }
}

function askProduct(productList) {
    let productNames = [];

    productList.forEach(product => {
        productNames.push(product.product_name);
    });

    console.log('');

    inquirer
        .prompt([
            {
                name: 'productToBuy',
                type: 'list',
                message: 'Which product would you like to buy?',
                choices: productNames
            },
            {
                name: 'amountToBuy',
                type: 'number',
                message: 'How many would you like to buy?'
            }
        ])
        .then((response) => {
            let product = helper.getObjByName(productList, response.productToBuy);

            updateProduct(product, response.amountToBuy);
        });
}

function updateProduct(product, amountToBuy) {
    if (product.stock_quantity < amountToBuy) {
        console.log('\nThe store doesn\'t have enough ' + product.product_name + 's.');
        return;
    }

    product.stock_quantity -= amountToBuy;
    const amountSpent = (product.price * amountToBuy).toFixed();

    updateDatabase(product, amountSpent);
}

async function updateDatabase(product, amountSpent) {
    try {
        let connection = await mysql.createConnection(connectionParams);
        await connection.query(
            `UPDATE products SET ? WHERE item_id = ? `,
            [
                product,
                product.item_id
            ]
        );

        console.log('\nYou spent $' + amountSpent + '.');
        connection.end();
    } catch (err) {
        console.log(err);
    }
}

connectToMySQL();