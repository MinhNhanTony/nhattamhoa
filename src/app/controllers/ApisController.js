const ProductModel = require("../models/Product");
const categoryModel = require("../models/Category");
const OrderModel = require("../models/Order");
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const provincesJSON = require('../../resource/json/provinces.json')
const { getProducts } = require('../../util/getDataFromDB')
const axios = require('axios').default;
var jwt = require('jsonwebtoken');
const {calculateShipPrice} = require('../../util/calculatePriceBeforeSaveToDB')
const moment = require('moment');
const { filterAvailableProduct} = require('../../util/ignoreProduct')

const {makeNumberSorter} = require('../../util/makeNumberSorter')
class ApisController {
  //  [POST]  / products
  async productsWithFilter(req, res) {


    let {gender="",category="",color="",price=""} = req.body;


    let productsCollection = await ProductModel.find({});
    let products = mutipleMongooseToObject(await filterAvailableProduct(productsCollection));

    let newProducts= [];
    if(gender.length !== 0) {
       const productWithGender = products.filter((product)=> {
        return gender.includes(product.productGender)});

        const productUnisex = products.filter((product)=> {
        return product.productGender === 'Unisex'})
        if(!gender.includes("Unisex")) {

          newProducts = [...productWithGender,...productUnisex]
        }
        else {
          newProducts = [...productWithGender]

        }

    
    }

    if(category.length !== 0) {
      newProducts = newProducts.filter((product)=> {
        return category.includes(product.category)  
      })
    }
    if(category.length !== 0 && gender.length === 0) {
      newProducts = products.filter((product)=> {
        return  category.includes(product.category)  
      })
    }

    if(price.length !== 0) {
      
      price.forEach((price)=> {
        const splitPriceString = price.split("-");
        const from = Number(splitPriceString[0]);
        const to = Number(splitPriceString[1]);
        newProducts = newProducts.filter((product)=> {
          return  product.productPrice > from && product.productPrice <= to ;
        })
      })
   

    }

    if(price.length !== 0 && gender.length === 0 && category.length === 0) {
      
      let save = [];
      price.forEach((price)=> {
        const splitPriceString = price.split("-");
        const from = Number(splitPriceString[0]);
        const to = Number(splitPriceString[1]);
        save = products.filter((product)=> {
          return  product.productPrice > from && product.productPrice <= to ;
        })
        newProducts = newProducts.concat(save)
      })

    }

    if(color.length !== 0 ) {
      newProducts = newProducts.filter((product)=> {
        return  color.includes(product.productColor) 
      })
    }
    if(color.length !== 0 && gender.length === 0 && category.length === 0 && price.length === 0) {
      newProducts = products.filter((product)=> {
        return  color.includes(product.productColor) 
      })

    }
    if(color.length === 0 && gender.length === 0 && category.length === 0 && price.length === 0) {
      newProducts = products.filter((product)=> {
        return  product
      })

    }
  
     res.json({products:await makeNumberSorter(newProducts)})
     products = [];
    
    // res.render('home',{products:mutipleMongooseToObject(products)});
  }


  async getProvinces(req, res) {
    res.json(provincesJSON);
  }

  // [POST] /apis/calculte-ship-price
  async calculateShipPrice(req , res) {

   const data =  req.body;

      const newDataprice =await calculateShipPrice(data);
      
      res.json(newDataprice)

  }

  // GET /apis/token

  async generateToken(req, res) {
      const token = jwt.sign({
        data: new Date()
      }, process.env.SECRET_KEY);

      res.json({token})
  }
  // GET /apis/category-list

  async getcategoryList(req, res) {
      const categoryList =await categoryModel.find({});

      res.json(categoryList)
  }
  // GET /apis/category-list

  async searhOrder(req, res) {
    try {
        const order = await OrderModel.findById(req.body.orderId.trim());
        if(order.status === "Waiting") {
          order.status = "Chờ xác nhận"
        }
        if(order.status === "Confirm") {
          order.status = "Đang giao"
        }
        if(order.status === "Cancel") {
          order.status = "Đã hủy"
        }
        const sevendaysAfter = moment(order?.createdAt).subtract(-1, 'days').startOf('day').format('DD/MM/YYYY');
        const orderTime = moment(order?.createdAt).format('DD/MM/YYYY, HH:mm')
 

        res.json({isSuccess:true,order,sevendaysAfter,orderTime});
      
    } catch (error) {
        res.json({isSuccess:false, message:"Đơn hàng không tồn tại"})
    }

  }


  //  POST /apis/get-total-price

  async getTotalPrice(req, res) {

    let cartProductList  = req.body;

    const totalMoney = cartProductList.reduce((total,curr,index)=> {
      return total+ (curr.cartItemPrice * curr.cartItemAmount)  ;
    },0)
    

    res.json(totalMoney)
}



 
}

module.exports = new ApisController();
