const ProductModal = require('../app/models/Product');

async function getProducts(isSpecial) {
  return await ProductModal.find({isSpecial:true}, function (err, docs) {

    try {
      if (err) {
        console.log(err);
      } else {
        return docs;
      }
    } catch (error) {
       console.log(error)
    }

  })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
}

async function getProduct(serverId) {
  return await ProductModal.findOne({ server_id: serverId }, function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      return doc;
    }
  })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
    
}

module.exports = { getProducts, getProduct };
