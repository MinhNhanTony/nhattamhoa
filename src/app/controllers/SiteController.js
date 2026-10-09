const ProductModel = require("../models/Product")
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { getProducts } = require('../../util/getDataFromDB')
const { filterAvailableProduct} = require('../../util/ignoreProduct')
const { makeNumberSorter} = require('../../util/makeNumberSorter')
const CategoryModel = require("../models/Category");

class SiteController {
  //  [GET]  /
async index(req, res) {

        res.header(
            "Access-Control-Allow-Origin",
            "http://localhost:3000"
        )

        // =========================
        // SẢN PHẨM NỔI BẬT
        // =========================

        const isSpecial = true

        const productsCollection = await getProducts(isSpecial)

        let products = await filterAvailableProduct(productsCollection)

        products = await makeNumberSorter(products)
        products = products.slice(0, 6);


        // =========================
        // SẢN PHẨM MỚI NHẤT
        // =========================

        const newestProduct = await ProductModel
            .find({ isAvailable: true })
            .sort({ _id: -1 })
            .limit(1)

        const newestProductObject =
            mongooseToObject(newestProduct[0])

        const newestProductAvatar =
            newestProductObject?.productImg?.[0]


        // =========================
        // LẤY CATEGORY
        // =========================

        const categories = await CategoryModel.find({})
            .sort({ _id: 1 })
            .lean()


        // =========================
        // LẤY SẢN PHẨM THEO CATEGORY
        // =========================

        const categoryCollections = await Promise.all(

            categories.map(async (category) => {

                const categoryProducts = await ProductModel
                    .find({
                        category: category.categoryName,
                        isAvailable: true
                    })
                    .sort({ _id: -1 })
                    .limit(8)
                    .lean()


                return {
                    categoryName: category.categoryName,
                    imageName: category.imageName,
                    products: categoryProducts
                }

            })

        )


        // =========================
        // RENDER
        // =========================

        res.render('home', {

            products: mutipleMongooseToObject(products),

            categories: categoryCollections,

            pageTitle:
                `NHẤT TÂM HOA - ${process.env.DOMAINNAME}`,

            newestProductAvatar,
            isHomePage: true,

            newestProduct:
                newestProductObject

        })

    }


  // [GET] /cart
  cart(req, res) {
    res.render('cart',{pageTitle:`Giỏ hàng của bạn - ${process.env.DOMAINNAME}`});
  }

  // [GET] /cart
  checkouts(req, res) {
    res.render('cart',{pageTitle:`Giỏ hàng của bạn - ${process.env.DOMAINNAME}`});
  }

   //  [GET]  / tra-cuu
   async searchOrder(req, res) { 
    res.render('searchOrder',{pageTitle:`Tra cứu - ${process.env.DOMAINNAME}`})
  }
}

module.exports = new SiteController();
