// REQUIRES
const inquirer = require('inquirer');
const helper = require('./helperFunctions');



// FUNCTIONS
async function getProductList() {
    const productList = await helper.getTableList('products');
    askManagerDuties(productList);
}

function askManagerDuties(productList) {
    console.log('');

    inquirer
        .prompt([
            {
                name: 'managerDuty',
                type: 'list',
                message: 'What would you like to do?',
                choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add new Product', 'Exit']
            }
        ])
        .then((response) => {
            const choice = response.managerDuty;

            switch (choice) {
                case 'View Products for Sale':
                    viewProducts(productList);
                    break;
                case 'View Low Inventory':
                    viewLowInventory(productList);
                    break;
                case 'Add to Inventory':
                    addToInventory(productList);
                    break;
                case 'Add new Product':
                    addNewProduct();
                    break;
            }
        }).catch((err) => {
            console.log(err);
            return;
        });
}

function viewProducts(productList) {
    helper.displayAllProducts(productList);
    askManagerDuties(productList);
}

function viewLowInventory(productList) {
    productList.forEach(product => {
        if (product.stock_quantity < 5) {
            helper.displayProduct(product);
            console.log('In Stock: ' + product.stock_quantity);
        }
    });
    askManagerDuties(productList);
}

function addToInventory(productList) {
    const productNames = productList.map((product) => { return product.product_name; });

    console.log('');

    inquirer
        .prompt([
            {
                name: 'productSelected',
                type: 'list',
                message: 'Which product would you like to add stock to?',
                choices: productNames
            },
            {
                name: 'amountToAdd',
                type: 'number',
                message: 'How many would you like to add?'
            }
        ])
        .then((response) => {
            const product = helper.getProductByName(productList, response.productSelected);

            updateProduct(product, response.amountToAdd);
        }).catch((err) => {
            console.log(err);
            return;
        });
}

async function updateProduct(product, amountToAdd) {
    if (isNaN(amountToAdd)) {
        getProductList();
        return;
    }

    product.stock_quantity += amountToAdd;
    await helper.updateTable('products', product);

    console.log('Success! ' + product.product_name + '\'s stock is now ' + product.stock_quantity + '.');

    getProductList();
}

function addNewProduct() {
    inquirer
        .prompt([
            {
                name: 'newProductName',
                type: 'input',
                message: 'What\'s the name of the item?'
            },
            {
                name: 'newProductDepartment',
                type: 'input',
                message: 'What department is the item in?'
            },
            {
                name: 'newProductPrice',
                type: 'number',
                message: 'How much will the item cost?'
            },
            {
                name: 'newProductQuantity',
                type: 'number',
                message: 'How many does the store have in stock?'
            }
        ])
        .then((response) => {
            const newProduct = {
                product_name: response.newProductName,
                department_name: response.newProductDepartment,
                price: response.newProductPrice,
                stock_quantity: response.newProductQuantity
            };
            
            helper.addToTable('products', newProduct);
            getProductList();
        }).catch((err) => {
            console.log(err);
            return;
        });
}



// FUNCTION CALLS
getProductList();