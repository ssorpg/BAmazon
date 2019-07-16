// REQUIRES
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const connectionParams = require('./ConParams');



// FUNCTIONS
async function conTest() {
    try {
        let connection = await mysql.createConnection(connectionParams);
        let [products] = await connection.query(
            `SELECT * FROM products`
        );

        askProduct(products);
        connection.end();
    } catch (err) {
        console.log(err);
    }
}

function askProduct(products) {
    let productNames = [];

    products.forEach(product => {
        productNames.push(product.product_name);
    });

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
            if (products[response.productToBuy].stock_quantity >= response.amountToBuy) {
                updateProduct(products);
            }
            else {
                console.log('The store doesn\'t have enough ' + response.productToBuy + 's.');
                return;
            }
        })
}

conTest();
console.log('Test');