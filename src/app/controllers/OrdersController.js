const OrderModel = require("../models/Order")
const ProductModel = require("../models/Product")
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { numberToMoney } = require('../../util/numberToMoney')
const {calculateShipPrice,getDiscountFromId} = require('../../util/calculatePriceBeforeSaveToDB');
var nodemailer = require('nodemailer');
const moment = require('moment');

const {exportTimeString} = require('../../util/time')
const hbs = require('nodemailer-express-handlebars')
  const path = require('path')



class OrdersController {
  //  [GET]  / checkouts


  async checkouts(req, res) {

      res.render('orders/checkouts',{pageTitle:`Thanh toán - ${process.env.DOMAINNAME}`})
  }

  async handleOrder(req, res) {
    try {
            
        let {userInfor,discountCode,orderPayOption,productInfor,totalPriceFromClient,note} = req.body;
        // Tính lại tổng giá đơn hàng và so sánh với giá trị gửi lên từ client ( sau khi giảm giá );

        const reViewProductInfor  = productInfor.map(async item=> {

          
          const currItemFromDB = await ProductModel.findById({_id:item.cartItemId});

          const {sale,productSalePrice,productPrice} = currItemFromDB
          const currItemPrice = sale ? productSalePrice : productPrice;

          if(currItemPrice !== item.cartItemPrice){
            // return res.json({isError:true, message:"Giá sản phẩm hiện tại không đúng"});
            item.cartItemPrice = currItemPrice
          }
          return item;

        })
        Promise.all(reViewProductInfor).then(async (productList) => {
          // Tính tổng giá tiền ( chưa giảm giá );

          let totalMoney = productList.reduce((total,curr,index)=> {
            return total+ (curr.cartItemPrice * curr.cartItemAmount)  ;
          },0)




          // GET giá ship

          async function getShipmentFee () {
            const cartProductId = productList.map((item)=> 
            {
              return {id:item.cartItemId,amount:item.cartItemAmount };
            })
      
      
            const shipmentFee = await calculateShipPrice({cartProductId,address:userInfor.address});
            const {fee:feeObject} = shipmentFee ;
            
            return feeObject.fee;
          }
          let shipmentFee = await getShipmentFee();
          const initshipmentFee = shipmentFee;

          if( totalMoney !== totalPriceFromClient) {
            totalPriceFromClient = totalMoney;
            return res.json({isErros:true,message: 'Giá không hợp lệ'});
          }


          // Áp dụng giảm giá

          let isError = false;
          async function ApplyDiscount() {

          
            const priceWithDiscountList = await discountCode.map(async (id)=> {
              const {priceWithDiscount,isSuccess} = await getDiscountFromId({id,    productPrice:totalMoney,shipmentFee},req,res);
                if(isSuccess === false){
                  isError = true;
                }
  
                return await priceWithDiscount;

              });

            
            await Promise.all(priceWithDiscountList).then((values) => {
                values.forEach(discount=> {
                      const {type,newFee} = discount;
                      if(type === "price") {
                        totalMoney = newFee;    
                      }
                      if(type === "ship") {
                        shipmentFee = newFee;
                      }
                })
              });
          }
          await ApplyDiscount();

          if(isError) {
             console.log("Thất bai")
          }
          else {
           //  Giá hợp lệ
            
            // Gửi Email
            function sendEmailAcceptToClient(orderId,orderDate,orderTime,finalPrice,discount,DOMAINNAME,sevendaysAfter) {

                
              //  Nodejs Email with nodemailer
              var transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: `${process.env.EMAILADDRESS}`,
                    pass: `${process.env.EMAILPASSWORD}`,
                },
              });


              // point to the template folder
              const handlebarOptions = {
                viewEngine: {
                  extName: ".hbs",
                  partialsDir: path.resolve("/.src/resource/views/"),
                  defaultLayout: false,
                },
                viewPath: path.resolve('./src/resource/views'),
                extName: ".hbs",
              };

              // use a template file with nodemailer
              transporter.use('compile', hbs(handlebarOptions))

             
              

              // const attachmentList = productInfor.map(function (product) {
              //   return {   // stream as an attachment
              //     path: `${process.env.DOMAINNAME}${product.cartItemImgUrl}`
              //   }
              // });
              // console.log("🚀 ~ file: OrdersController.js:156 ~ OrdersController ~ attachmentList ~ attachmentList", attachmentList)
              const mailList = [`${userInfor.email}`,`${process.env.ADMIN_EMAIL}`]
              
              var mailOptions = {
                from: `"QANA NOLAN" ${process.env.EMAILADDRESS}`,
                to: mailList,
                subject: 'XÁC NHẬN ĐẶT HÀNG',
                text: 'Xin chào bạn',
                // attachments:attachmentList,
                
                template:'email',
                context: {
                  username:userInfor.name,
                  address: userInfor.address,
                  orderId:orderId,
                  orderDate,
                  orderTime,
                  finalPrice,
                  discount,
                  productInfor,
                  DOMAINNAME:DOMAINNAME,
                  sevendaysAfter
                  
                }
              
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
              });

             }



              // Lưu vào Database;

              const priceWithDiscount = totalMoney +  shipmentFee;
              const discount = (totalPriceFromClient + initshipmentFee) - priceWithDiscount
              
              
              const dataForSave = {
                price:totalMoney,
                ship:shipmentFee,
                finalPrice:priceWithDiscount ,
                discount ,
                userInfor,
                orderPayOption,
                productList,
                note        
              }


              OrderModel.create(dataForSave, async function (err, small) {
                if (err) console.log(err);
            
              
                const {orderDate,orderTime} =  await exportTimeString(small?.createdAt);
                const sevendaysAfter = moment(small?.createdAt).subtract(-7, 'days').startOf('day').format('DD/MM/YYYY');
                
                  sendEmailAcceptToClient(small._id,orderDate,orderTime,await numberToMoney(priceWithDiscount),await numberToMoney(discount),process.env.DOMAINNAME,sevendaysAfter);

                  
                  //  Tăng số lượng bán sau khi mua
                  productList.forEach(async product => {
                    const productCollection = await ProductModel.findById(product.cartItemId);


                    productCollection.set({quantitySold:Number(productCollection.quantitySold)+ Number(product.cartItemAmount)});
  
                    await productCollection.save();
         
                
                  })

                  res.json({isError:false,orderId:small._id,message:"Đặt hàng thành công, vui lòng kiểm tra email và chờ CSKH liên hệ"});

                
              });

              }

        
            
      
        })
      
    } catch (error) {
        console.log(error)
    }

  }

}

module.exports = new OrdersController();
