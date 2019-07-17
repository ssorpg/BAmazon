// REQUIRES
const inquirer = require('inquirer');
const helper = require('./HelperFunctions');



// FUNCTIONS
async function connectToMySQL() {
    let productList = await helper.getProductList();
    askProduct(productList);
}

function askProduct(productList) {
    const productNames = productList.map((product) => { return product.product_name; });

    helper.displayAllProducts(productList);

    console.log('');

    inquirer
        .prompt([
            {
                name: 'productSelected',
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
            const product = helper.getProductByName(productList, response.productSelected);

            updateProduct(product, response.amountToBuy);
        }).catch((err) => {
            console.log(err);
        });
}

async function updateProduct(product, amountToBuy) {
    if (isNaN(amountToBuy)) {
        newPurchase();
        return;
    }
    else if (product.stock_quantity < amountToBuy) {
        console.log('\nThe store doesn\'t have that many ' + product.product_name + 's.');
        newPurchase();
        return;
    }

    product.stock_quantity -= amountToBuy;
    await helper.updateDatabase(product);

    const amountSpent = (product.price * amountToBuy).toFixed(2);
    console.log('\nYou spent $' + amountSpent);

    newPurchase();
}

function newPurchase() {
    console.log('');

    inquirer
        .prompt([
            {
                name: 'doNewPurchase',
                type: 'confirm',
                message: 'Would you like to purchase another item?'
            }
        ])
        .then((response) => {
            if (response.doNewPurchase) {
                connectToMySQL();
            }
        }).catch((err) => {
            console.log(err);
        });
}



// FUNCTION CALLS
connectToMySQL();