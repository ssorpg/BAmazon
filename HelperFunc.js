// FUNCTIONS
function getProductByName(productList, name) {
    let foundProduct = productList.find((curProduct) => { return curProduct.product_name === name; });

    return foundProduct;
}



// EXPORTS
module.exports = {
    getProductByName: getProductByName
};