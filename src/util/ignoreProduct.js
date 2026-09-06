  
async function filterAvailableProduct(products) {
      return products.filter(product => {
          return product.isAvailable? true : false;
      })
}


module.exports = { filterAvailableProduct };
