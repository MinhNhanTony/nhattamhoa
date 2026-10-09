const OrderModel = require("../models/Order")
const ProductModel = require("../models/Product")
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { numberToMoney } = require('../../util/numberToMoney')
const {calculateShipPrice,getDiscountFromId} = require('../../util/calculatePriceBeforeSaveToDB');
var nodemailer = require('nodemailer');
const { Resend } = require("resend");
const moment = require('moment');
const Handlebars = require("handlebars");
const {exportTimeString} = require('../../util/time')
const hbs = require('nodemailer-express-handlebars')
  const path = require('path')
const fs = require("fs/promises");
const resend = new Resend(process.env.RESEND_API_KEY);

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
          async function sendEmailAcceptToClient(
    orderId,
    orderDate,
    orderTime,
    finalPrice,
    discount,
    DOMAINNAME,
    sevendaysAfter
) {
    try {
        // Đường dẫn template email hiện tại
        const viewsDir = path.resolve("./src/resource/views");
        const templatePath = path.join(viewsDir, "email.hbs");

        // Đọc nội dung template
        const templateSource = await fs.readFile(
            templatePath,
            "utf8"
        );

        // Đăng ký partial nếu thư mục này tồn tại
        const partialsDir = path.join(viewsDir, "partials");

        try {
            const partialFiles = await fs.readdir(partialsDir);

            for (const file of partialFiles) {
                if (file.endsWith(".hbs")) {
                    const partialName = path.basename(file, ".hbs");
                    const partialContent = await fs.readFile(
                        path.join(partialsDir, file),
                        "utf8"
                    );

                    Handlebars.registerPartial(
                        partialName,
                        partialContent
                    );
                }
            }
        } catch (error) {
            // Không có thư mục partials thì bỏ qua
            if (error.code !== "ENOENT") {
                throw error;
            }
        }

        // Render template với dữ liệu đơn hàng
        const template = Handlebars.compile(templateSource);

        const html = template({
            username: userInfor.senderName,
            address: userInfor.address,
            orderId,
            orderDate,
            orderTime,
            finalPrice,
            discount,
            productInfor,
            DOMAINNAME,
            sevendaysAfter
        });

        // Gửi email qua Resend
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM,
            to: userInfor.email,
            cc: process.env.ADMIN_EMAIL
                ? [process.env.ADMIN_EMAIL]
                : undefined,
            subject: "XÁC NHẬN ĐẶT HÀNG - NHẤT TÂM HOA",
            html
        });

        if (error) {
            console.error("Resend gửi email thất bại:", {
                orderId,
                error
            });

            return {
                success: false,
                error
            };
        }

        console.log("Gửi email thành công:", {
            orderId,
            emailId: data.id
        });

        return {
            success: true,
            emailId: data.id
        };

    } catch (error) {
        console.error(
            `Lỗi gửi email đơn hàng ${orderId}:`,
            error.message
        );

        return {
            success: false,
            error: error.message
        };
    }
}



              // Lưu vào Database;

              const priceWithDiscount = totalMoney;
              const discount = (totalPriceFromClient + initshipmentFee) - priceWithDiscount
              
              
              const dataForSave = {
                price:totalMoney,
                ship:0,
                finalPrice:priceWithDiscount ,
                discount:0 ,
                userInfor,
                orderPayOption,
                productList,
                note        
              }


              OrderModel.create(dataForSave, async function (err, small) {
                if (err) console.log(err);
            
              
                const {orderDate,orderTime} =  await exportTimeString(small?.createdAt);
                const sevendaysAfter = moment(small?.createdAt).subtract(-2, 'days').startOf('day').format('DD/MM/YYYY');
                
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
