const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require('../../util/mongoose');
const ProductModel = require('../../app/models/Product');
const categoryModel = require('../../app/models/Category');
const { filterAvailableProduct} = require('../../util/ignoreProduct')
const { makeNumberSorter} = require('../../util/makeNumberSorter')
const { ArrayObject} = require('../../util/shuffleArr')


function sort (products,sortBy) {


  if(sortBy =='newest') {
    //  ĐỢI LÀM CHỨC NĂNG THÊM SẢN PHẨM ĐỂ CÓ TRƯỜNG CREATEAT
    return products.reverse();
  }
  else if(sortBy =='price-ascending') {
    return products.sort(function(a,b) {
      return a.productSalePrice - b.productSalePrice;
    })
  }
  else if(sortBy =='best-sale') {
    return products.sort(function(a,b) {
          console.log(a.quantitySold,b.quantitySold)
      return Number(b.quantitySold) - Number(a.quantitySold);
    })
  }
  else {
    return products
  }
    
} 

function getPathName (req) {
  return req.originalUrl;
}


function PaginationProducts (req,products) {

      const limit = 10;
      const page = req.query.page || 1;

      const totalProducts = products.length;

      const totalPages = Math.ceil(totalProducts / limit);

      products = products.slice((page - 1) * limit, page * limit);
      
      const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

      const data = {products,pages,page};
      return data;

}

class CollectionsController {
  //  [GET]  /
  async maleProduct(req, res) {
    let productsMaleCollection = await ProductModel.find({ productGender: 'Male' });
    let productsUnisexCollection = await ProductModel.find({ productGender: 'Unisex' });

    let productsCollection = [...productsMaleCollection,...productsUnisexCollection]

    let products = await filterAvailableProduct(productsCollection)

    const {sortBy} = req.query;
    let newproducts;

    if(sortBy) {
      newproducts= sort(products,sortBy);
    }
    else {
      newproducts = products;
    }
    products = await makeNumberSorter(newproducts);

    // console.log(products.length)


   

    res.render('collections/maleProduct', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req),
      pageTitle:`Giày Sneaker Nam Chất Lượng Giá Tốt - ${process.env.DOMAINNAME}`
    });
  }
  async femaleProduct(req, res) {
    let productsFemaleCollection = await ProductModel.find({ productGender: 'Female' });
    let productsUnisexCollection = await ProductModel.find({ productGender: 'Unisex' });

    let productsCollection = [...productsFemaleCollection,...productsUnisexCollection]
    let products = await filterAvailableProduct(productsCollection)

    const {sortBy} = req.query;
    let newproducts;

    if(sortBy) {
      newproducts= sort(products,sortBy);
    }
    else {
      newproducts = products;
    }
    products = await makeNumberSorter(newproducts);


    res.render('collections/femaleProduct', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req),
      pageTitle:`Giày Sneaker Nữ Chất Lượng Giá Tốt- ${process.env.DOMAINNAME}`


    });
  }
  async unisexProduct(req, res) {
    let productsCollection = await ProductModel.find({ productGender: 'Unisex' });
    let products = await filterAvailableProduct(productsCollection)

    const {sortBy} = req.query;
    let newproducts;

    if(sortBy) {
      newproducts= sort(products,sortBy);
    }
    else {
      newproducts = products;
    }
    products = await makeNumberSorter(newproducts);

    res.render('collections/unisexProduct', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req),
      pageTitle:`Giày Sneaker Hack Chất Lượng Giá Tốt- ${process.env.DOMAINNAME}`
    });
  }

  async saleProduct(req, res) {
    let productsCollection = await ProductModel.find();
    let products = await filterAvailableProduct(productsCollection)

    const {sortBy} = req.query;
    let newproducts;

    if(sortBy) {
      newproducts= sort(products,sortBy);
    }
    else {
      newproducts = products;
    }
    products = await makeNumberSorter(newproducts);
    const saleProduct = products.filter(product => {
      return product.sale !== 0;
    });

    res.render('collections/saleProduct', {
      products: mutipleMongooseToObject(saleProduct),
      path:getPathName(req),
      pageTitle:`Giày Sneaker Khuyến mãi Chất Lượng Giá Tốt- ${process.env.DOMAINNAME}`
    });
  }
  async allProduct(req, res) {
     
    let productsCollection = await ProductModel.find({});
    let products = await filterAvailableProduct(productsCollection)

    const {sortBy} = req.query;
    let newproducts;

    if(sortBy) {
      newproducts= sort(products,sortBy);
    }
    else {
      newproducts = products;
    }
    products = await makeNumberSorter(newproducts);
    // products = await ArrayObject(newproducts);
    // Get list category
    const categoryList = await categoryModel.find({});
    //  Get List color
    let uniqueColor = [];
    products.forEach((c) => {
        if (!uniqueColor.includes(c.productColor)) {
            uniqueColor.push(c.productColor);
        }
    });
    // Price range
    let priceRange = [
      {from:0, to:200000,valueString:"Dưới 200.000đ"},
      {from:200000, to:400000,valueString:"200.000đ-400.000đ"},
      {from:400000, to:1000000,valueString:"400.000đ-1.000.000đ"}, 
      {from:1000000, to:99999999999,valueString:"Trên 1.000.000đ"}
    ];

    const data = PaginationProducts(req,products);
    products =  data.products;

    const pages = data.pages;
    const currentPage = data.page;

    

  
    res.render('collections/allProduct', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req),
      categoryList:mutipleMongooseToObject(categoryList),
      listColor:uniqueColor,
      priceRange,
      pages,
      currentPage,
      pageTitle:`Tất cả sản phẩm - ${process.env.DOMAINNAME}`

    });

    uniqueColor = [];
  }

  async newArrivalProduct(req, res) {
    let productsCollection = await ProductModel.find();
    let products = await filterAvailableProduct(productsCollection);

    const {sortBy = 'newest'} = req.query;

    let newproducts;

    if(sortBy) {
      newproducts= sort(products,sortBy);
    }
    else {
      newproducts = products;
    }
    products = await makeNumberSorter(newproducts);
  
    res.render('collections/newArrival', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req),
      pageTitle:`Giày Sneaker Hàng Mới Về ưu đãi - ${process.env.DOMAINNAME}`

    });
  }

  async categoryProduct(req, res) {
    const categoryName = req.params.name;

    let productsCollection = await ProductModel.find({ category: categoryName});
    let products = await filterAvailableProduct(productsCollection);

    const {sortBy} = req.query;
    let newproducts;

    if(sortBy) {
      newproducts= sort(products,sortBy);
    }
    else {
      newproducts = products;
    }
    products = await makeNumberSorter(newproducts);

    res.render('collections/categoryProduct', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req),
      categoryName:categoryName,
      pageTitle:`Sản phẩm Unisex - ${process.env.DOMAINNAME}`


    });
  }
}

module.exports = new CollectionsController();
