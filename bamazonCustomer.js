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
    const productNames = productList.map((product) => { return product.product_name; });

    productList.forEach(product => {
        console.log('\nProduct ' + product.item_id);
        console.log('Name: ' + product.product_name);
        console.log('Price: $' + product.price);
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
            const product = helper.getProductByName(productList, response.productToBuy);

            updateProduct(product, response.amountToBuy);
        }).catch((err) => {
            console.log(err);
        });
}

function updateProduct(product, amountToBuy) {
    if (product.stock_quantity < amountToBuy) {
        console.log('\nThe store doesn\'t have that many ' + product.product_name + 's.');
        return;
    }

    product.stock_quantity -= amountToBuy;
    const amountSpent = (product.price * amountToBuy).toFixed(2);

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



// FUNCTION CALLS
connectToMySQL();